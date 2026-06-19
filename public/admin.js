const inviteCopyText = document.querySelector("#inviteCopyText");
const inviteCopyButton = document.querySelector("#inviteCopyButton");

inviteCopyButton?.addEventListener("click", async () => {
  const text = inviteCopyText?.value || "";

  try {
    await navigator.clipboard.writeText(text);
    inviteCopyButton.textContent = "已复制";
  } catch {
    inviteCopyText?.select();
    document.execCommand("copy");
    inviteCopyButton.textContent = "已复制";
  }

  window.setTimeout(() => {
    inviteCopyButton.textContent = "复制邀请文案";
  }, 1800);
});
