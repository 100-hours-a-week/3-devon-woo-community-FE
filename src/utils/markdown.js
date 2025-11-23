export function parseMarkdown(markdown = '') {
  if (!markdown || !markdown.trim()) return '';

  let html = markdown;

  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  html = html.replace(/^- \[ \] (.*)$/gim, '<ul class="checklist"><li>$1</li></ul>');
  html = html.replace(/^- \[x\] (.*)$/gim, '<ul class="checklist"><li class="checked">$1</li></ul>');
  html = html.replace(/^- (.*)$/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/^\d+\. (.*)$/gim, '<ol><li>$1</li></ol>');

  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '\n');

  html = html.replace(/^---$/gim, '<hr>');

  html = html
    .split('\n')
    .map((line) => {
      if (
        line.trim() &&
        !line.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div)/) &&
        !line.match(/<\/(h[1-6]|ul|ol|li|blockquote|pre|code|div)>$/)
      ) {
        return `<p>${line}</p>`;
      }
      return line;
    })
    .join('\n');

  return html;
}
