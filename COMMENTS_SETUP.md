# Staticman Comments Setup

To use Staticman comments instead of Disqus:

1. Change your _config.yml:
```yaml
comments:
  provider: "staticman"
```

2. The staticman configuration is already set up in your _config.yml:
```yaml
staticman:
  allowedFields: ['name', 'email', 'url', 'message']
  branch: "gh-pages"  # or "master" depending on your setup
  commitMessage: "New comment."
  filename: comment-{@timestamp}
  format: "yml"
  moderation: true
  path: "_data/comments/{options.slug}"
  requiredFields: ['name', 'email', 'message']
```

3. You'll need to set up the Staticman app on your GitHub repository
4. Comments will be stored as files in your `_data/comments/` directory

Note: Staticman requires more setup but gives you full control over your comments.
