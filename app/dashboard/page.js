import { requireSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireSession("customer");

  return (
    <main className="page-shell">
      <canvas id="auroraCanvas" aria-hidden="true" />
      <aside className="sidebar glass-panel">
        <div className="brand">
          <div className="brand-mark">AS</div>
          <div>
            <strong>AuroraShip</strong>
            <span>US Label Console</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="主导航">
          <a className="nav-item active" href="#overview">总览</a>
          <a className="nav-item" href="#create">创建面单</a>
          <a className="nav-item" href="#shipments">订单记录</a>
          <a className="nav-item" href="#pricing">价格表</a>
          <a className="nav-item" href="#wallet">钱包</a>
        </nav>
        <div className="sidebar-footer">
          <form className="logout-form" action="/api/auth/logout" method="post">
            <button className="secondary-button full" type="submit">退出登录</button>
          </form>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar glass-panel">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>美国打单系统工作台</h1>
          </div>
          <div className="top-actions">
            <div className="balance-chip">
              <span>当前账号</span>
              <strong>{session.username}</strong>
            </div>
            <div className="balance-chip">
              <span>可用余额</span>
              <strong>$8,420.60</strong>
            </div>
            <button className="primary-button">新建面单</button>
          </div>
        </header>

        <section className="metrics-grid" id="overview">
          {[
            ["今日面单", "284", "较昨日 +18.6%"],
            ["本月消费", "$42.8k", "Stripe 充值占 72%"],
            ["待处理异常", "7", "地址校验 / 扣费回滚"],
            ["价格表", "VIP-West-A", "专属客户价格"]
          ].map((item) => (
            <article className="metric-card glass-panel" key={item[0]}>
              <div className="metric-icon cyan" />
              <span>{item[0]}</span>
              <strong>{item[1]}</strong>
              <small>{item[2]}</small>
            </article>
          ))}
        </section>

        <section className="main-grid">
          <article className="label-panel glass-panel" id="create">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Create Label</p>
                <h2>创建新面单</h2>
              </div>
              <div className="segmented-control" role="group" aria-label="承运商">
                <button className="carrier-option active" data-carrier="FedEx">FedEx</button>
                <button className="carrier-option" data-carrier="UPS">UPS</button>
                <button className="carrier-option" data-carrier="USPS">USPS</button>
              </div>
            </div>
            <div className="form-grid">
              <label>
                <span>客户</span>
                <select><option>Blue Harbor Trading</option></select>
              </label>
              <label>
                <span>服务</span>
                <select id="serviceSelect"><option>Ground Advantage</option></select>
              </label>
              <label>
                <span>重量</span>
                <div className="input-with-unit">
                  <input id="weightInput" type="number" min="1" max="150" defaultValue="12" />
                  <span>lb</span>
                </div>
              </label>
              <label>
                <span>包裹尺寸</span>
                <input defaultValue="12 x 8 x 6 in" />
              </label>
              <label className="wide">
                <span>发件地址</span>
                <input defaultValue="185 Berry St, San Francisco, CA 94107" />
              </label>
              <label className="wide">
                <span>收件地址</span>
                <input defaultValue="228 Park Ave S, New York, NY 10003" />
              </label>
            </div>
            <div className="quote-strip">
              <div><span>预计扣费</span><strong id="quoteAmount">$14.82</strong></div>
              <div><span>客户价格表</span><strong>VIP-West-A</strong></div>
              <div><span>API 状态</span><strong className="good-text">Ready</strong></div>
              <button className="primary-button compact">生成面单</button>
            </div>
          </article>

          <aside className="label-preview glass-panel">
            <div className="preview-top">
              <span className="status-pill">Draft</span>
              <span>4 x 6 Thermal</span>
            </div>
            <div className="label-paper">
              <div className="barcode-lines">
                <span /><span /><span /><span /><span /><span />
              </div>
              <div>
                <strong id="previewCarrier">FedEx</strong>
                <p>TRK 7829 4410 9932</p>
              </div>
              <div className="label-route"><span>SFO</span><span>→</span><span>NYC</span></div>
              <div className="label-address">
                <span>TO</span>
                <strong>228 Park Ave S</strong>
                <small>New York, NY 10003</small>
              </div>
            </div>
            <button className="secondary-button full">下载 PDF 预览</button>
          </aside>
        </section>

        <section className="lower-grid">
          <article className="data-panel glass-panel" id="shipments">
            <div className="section-heading tight"><div><p className="eyebrow">Shipments</p><h2>最近面单</h2></div></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>订单号</th><th>客户</th><th>承运商</th><th>状态</th><th>扣费</th></tr></thead>
                <tbody>
                  <tr><td>#LX-10482</td><td>Blue Harbor</td><td>FedEx Ground</td><td><span className="status-pill good">已生成</span></td><td>$14.82</td></tr>
                  <tr><td>#LX-10481</td><td>Northstar Auto</td><td>UPS 2Day</td><td><span className="status-pill">待支付</span></td><td>$28.40</td></tr>
                </tbody>
              </table>
            </div>
          </article>
          <article className="data-panel glass-panel" id="pricing">
            <div className="section-heading tight"><div><p className="eyebrow">Pricing</p><h2>客户价格表</h2></div></div>
            <div className="price-list">
              <div className="price-row"><span className="carrier-dot fedex" /><div><strong>FedEx Ground</strong><small>Zone 2-5, 1-20 lb</small></div><b>成本 + 8%</b></div>
              <div className="price-row"><span className="carrier-dot ups" /><div><strong>UPS 2Day</strong><small>Zone 2-8, 1-50 lb</small></div><b>成本 + $3.20</b></div>
            </div>
          </article>
          <article className="data-panel glass-panel wallet-panel" id="wallet">
            <div className="section-heading tight"><div><p className="eyebrow">Wallet</p><h2>钱包流水</h2></div></div>
            <div className="wallet-stack">
              <div className="wallet-row"><span>Stripe 充值</span><strong className="good-text">+$500.00</strong></div>
              <div className="wallet-row"><span>面单扣费 #LX-10482</span><strong>-$14.82</strong></div>
            </div>
          </article>
        </section>
      </section>
      <script src="/aurora.js" />
      <script src="/dashboard.js" />
    </main>
  );
}
