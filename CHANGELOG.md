# Changelog

## 1.0.0 (2026-07-08)


### Features

* add Ornstein-Uhlenbeck and jump-diffusion algorithms ([3f5e372](https://github.com/Ruthgyeul/stockPriceGenerator/commit/3f5e37289685b393fb0ea79d13c9094a51e08426))
* add Ornstein-Uhlenbeck and jump-diffusion algorithms ([fc08b71](https://github.com/Ruthgyeul/stockPriceGenerator/commit/fc08b71fee6534d8cc518ed9931a4e65ac10263f)), closes [#29](https://github.com/Ruthgyeul/stockPriceGenerator/issues/29)
* track the previous price via getPreviousPrice(), onPrice, and result.previousPrice ([4f84b8e](https://github.com/Ruthgyeul/stockPriceGenerator/commit/4f84b8eee264d173a9196b790f67a774da1f87d3))
* track the previous price via getPreviousPrice(), onPrice, and result.previousPrice ([742dcba](https://github.com/Ruthgyeul/stockPriceGenerator/commit/742dcba1200e56a015adbc138ad3d16c62c78473)), closes [#19](https://github.com/Ruthgyeul/stockPriceGenerator/issues/19)


### Bug Fixes

* minMax bounce logic, non-functional delisting, and continuous-generator drift ([#20](https://github.com/Ruthgyeul/stockPriceGenerator/issues/20)) ([d734149](https://github.com/Ruthgyeul/stockPriceGenerator/commit/d734149c839ef828e085f427c944622ab953a3a6))
* repeated seed, unclamped startPrice, and broken interval test ([9b698a9](https://github.com/Ruthgyeul/stockPriceGenerator/commit/9b698a9884874a3f0398d02ba5276772b2be087b))
* repeated seed, unclamped startPrice, and broken interval test ([5bfdd2f](https://github.com/Ruthgyeul/stockPriceGenerator/commit/5bfdd2f9e754c82a7ce1cfb3b2b6f68f30bc2c84))
* replace setInterval with recursive setTimeout in continuous generator ([cdbe4a8](https://github.com/Ruthgyeul/stockPriceGenerator/commit/cdbe4a88ccd07bea835200d995975f85620dfeb5))
* replace setInterval with recursive setTimeout in continuous generator ([7f9121f](https://github.com/Ruthgyeul/stockPriceGenerator/commit/7f9121f0d29ad0be70642d96040a76800a71c644)), closes [#31](https://github.com/Ruthgyeul/stockPriceGenerator/issues/31)
* validate startPrice, length, and min/max before generating prices ([fa939a6](https://github.com/Ruthgyeul/stockPriceGenerator/commit/fa939a66c0c7d9e5f93d9757c8a276ef498aabd9))
* validate startPrice, length, and min/max before generating prices ([41ef161](https://github.com/Ruthgyeul/stockPriceGenerator/commit/41ef16104bc7c254551bcdca605c49f9bf75647d)), closes [#25](https://github.com/Ruthgyeul/stockPriceGenerator/issues/25)
