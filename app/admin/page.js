import { requireSession, supabaseRequest } from "@/lib/auth";

function formatDate(value) {
  if (!value) return "从未登录";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function AdminPage() {
  const session = await requireSession("admin");
  const [users, invites] = await Promise.all([
    supabaseRequest("app_users?select=*&order=created_at.desc"),
    supabaseRequest("invite_codes?select=*&order=created_at.desc&limit=8")
  ]);
  const latestInvite = invites.find((invite) => invite.status === "open");
  const invitationText = latestInvite
    ? `请打开以下网站注册账号：\nhttps://usa-label-system.vercel.app/register\n\n邀请码：\n${latestInvite.code}\n\n注册后你可以使用自己的账号和密码登录打单系统。`
    : "创建一个邀请码后，这里会自动生成可复制的邀请文案。";

  return (
    <main className="admin-shell">
      <canvas id="auroraCanvas" aria-hidden="true" />
      <aside className="sidebar glass-panel">
        <div className="brand">
          <div className="brand-mark">AS</div>
          <div>
            <strong>AuroraShip</strong>
            <span>Admin Console</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="管理员导航">
          <a className="nav-item active" href="/admin">客户与邀请码</a>
          <a className="nav-item" href="/dashboard">查看客户台</a>
        </nav>
        <div className="sidebar-footer">
          <form className="logout-form" action="/api/auth/logout" method="post">
            <button className="secondary-button full" type="submit">退出登录</button>
          </form>
        </div>
      </aside>

      <section className="admin-main">
        <header className="topbar glass-panel">
          <div>
            <p className="eyebrow">Administrator</p>
            <h1>管理员后台</h1>
          </div>
          <div className="balance-chip">
            <span>当前账号</span>
            <strong>{session.username}</strong>
          </div>
        </header>

        <section className="admin-grid">
          <article className="admin-panel glass-panel">
            <div className="section-heading tight">
              <div>
                <p className="eyebrow">Invite</p>
                <h2>新增用户邀请码</h2>
              </div>
            </div>
            <form className="admin-form" action="/api/admin/invites" method="post">
              <label>
                <span>备注</span>
                <input name="note" placeholder="客户公司名或用途" />
              </label>
              <button className="primary-button" type="submit">生成邀请码</button>
            </form>
          </article>

          <article className="admin-panel glass-panel">
            <div className="section-heading tight">
              <div>
                <p className="eyebrow">Copy</p>
                <h2>可复制邀请文案</h2>
              </div>
            </div>
            <div className="copy-block">
              <textarea className="copy-text" readOnly value={invitationText} />
              <p className="muted-text">复制这段发给客户即可。客户注册后会出现在下面的用户列表里。</p>
            </div>
          </article>
        </section>

        <article className="data-panel glass-panel">
          <div className="section-heading tight">
            <div>
              <p className="eyebrow">Users</p>
              <h2>客户用户</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>账号</th>
                  <th>名称</th>
                  <th>邀请码</th>
                  <th>最近登录</th>
                  <th>重置密码</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.display_name || "-"}</td>
                    <td>{user.invite_code || "-"}</td>
                    <td>{formatDate(user.last_login_at)}</td>
                    <td>
                      <form className="reset-form" action="/api/admin/reset-password" method="post">
                        <input type="hidden" name="userId" value={user.id} />
                        <input name="password" type="password" placeholder="新密码" minLength="8" required />
                        <button className="ghost-button" type="submit">重置</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5">还没有客户注册。先生成邀请码发给客户。</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>

        <article className="data-panel glass-panel">
          <div className="section-heading tight">
            <div>
              <p className="eyebrow">Invites</p>
              <h2>最近邀请码</h2>
            </div>
          </div>
          <div className="price-list">
            {invites.map((invite) => (
              <div className="price-row" key={invite.id}>
                <span className="carrier-dot fedex" />
                <div>
                  <strong>{invite.code}</strong>
                  <small>{invite.note || "无备注"}</small>
                </div>
                <b>{invite.status}</b>
              </div>
            ))}
          </div>
        </article>
      </section>
      <script src="/aurora.js" />
    </main>
  );
}
