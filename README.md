# subscription-fetcher

```yml
jobs:
  dev:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Fetch subscription files
        uses: dongchengjie/subscription-fetcher@main
        with:
          config: https://example.com/config.json # or yaml
        #   whitelist: foo,bar
        #   blacklist: foo,bar
```
