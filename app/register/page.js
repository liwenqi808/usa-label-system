const errorText = {
  invalid: "请填写邀请码、账号，并设置至少 8 位密码。",
  invite: "邀请码无效，或已经被使用。",
  username: "这个账号已经被使用，请换一个。"
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="auth-shell">
      <canvas id="auroraCanvas" aria-hidden="true" />
      <section className="auth-card glass-panel">
        <div className="brand">
          <div className="brand-mark">AS</div>
          <div>
            <strong>AuroraShip</strong>
            <span>Invite Registration</span>
          </div>
        </div>
        <h1>使用邀请码注册</h1>
        <p>输入管理员给你的邀请码，然后设置自己的账号和密码。</p>
        {error ? <div className="alert">{errorText[error] || errorText.invalid}</div> : null}
        <form className="auth-form" action="/api/auth/register" method="post">
          <label>
            <span>邀请码</span>
            <input name="inviteCode" placeholder="ABCD-1234" required />
          </label>
          <label>
            <span>姓名 / 公司名</span>
            <input name="displayName" autoComplete="name" />
          </label>
          <label>
            <span>账号</span>
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            <span>密码</span>
            <input name="password" type="password" autoComplete="new-password" minLength="8" required />
          </label>
          <button className="primary-button" type="submit">创建账号</button>
        </form>
        <div className="auth-links">
          <a href="/login">已有账号，返回登录</a>
        </div>
      </section>
      <script src="/aurora.js" />
    </main>
  );
}
