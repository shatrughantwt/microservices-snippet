import test from 'node:test';
import assert from 'node:assert/strict';

await test('snippet controller exports function handlers', async () => {
  const snippetModule = await import('../snippet/controller/snippet.js');
  assert.equal(typeof snippetModule.createSnippet, 'function');
  assert.equal(typeof snippetModule.getSnippet, 'function');
});

await test('comments controller exports function handlers', async () => {
  const commentModule = await import('../comments/controller/comment.js');
  assert.equal(typeof commentModule.createComment, 'function');
  assert.equal(typeof commentModule.getCommentBySnippetId, 'function');
});
