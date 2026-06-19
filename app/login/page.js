export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const hasError = params?.error;

  return (
    <main className="auth-shell">
      <canvas id="auroraCanvas" aria-hidden="true" />
      <section className="auth-card glass-panel">
        <div className="brand">
          <div className="brand-mark">AS</div>
          <div>
            <strong>AuroraShip</strong>
            <span>US Label Console</span>
          </div>
        </div>
        <h1>登录打单系统</h1>
        <p>管理员和客户都从这里登录。管理员登录后进入管理后台，客户登录后进入打单工作台。</p>
        {hasError ? <div className="alert">账号或密码不正确，请重新输入。</div> : null}
        <form className="auth-form" action="/api/auth/login" method="post">
          <label>
            <span>账号</span>
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            <span>密码</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="primary-button" type="submit">登录</button>
        </form>
        <div className="auth-links">
          <a href="/register">我有邀请码，注册账号</a>
          <span>无需短信或邮箱验证码</span>
        </div>
      </section>
      <script src="/aurora.js" />
    </main>
  );
}
