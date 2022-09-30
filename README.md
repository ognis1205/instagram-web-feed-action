# Instagram Web Feed Action

A GitHub action that generates a web feed from an Instagram accounts.

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: RSS
on:
  schedule:
    - cron: "0 17 * * *"
  push:

jobs:
  generate_web_feed:
    runs-on: macOS-latest
    name: Generate Web Feed
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: WebFeed
        id: web_feed
        uses: ognis1205/instagram-web-feed-action@v0.1.0
        with:
          username: ${{ secrets.INSTAGRAM_USERNAME }}
          password: ${{ secrets.INSTAGRAM_PASSWORD }}
      - name: Commit files
        if: ${{ success() && steps.web_feed.outputs.STATUS == 'success' }}
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "Updated instagram.json"
          git push
```
