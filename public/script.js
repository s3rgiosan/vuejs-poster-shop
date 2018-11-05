const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
  el: "#app",
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: "",
    lastSearch: "",
    loading: false,
    price: PRICE
  },
  methods: {
    appendItems: function () {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function () {
      if (this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http.get("/search/".concat(this.newSearch)).then(function (res) {
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.appendItems();
          this.loading = false;
        });
      }
    },
    addItem: function (index) {
      this.total += PRICE;

      const item = this.items[index];
      let found = false;

      for (let index = 0; index < this.cart.length; index++) {
        const element = this.cart[index];
        if (element.id === item.id) {
          element.qty++;
          found = true;
          break;
        }
      }

      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },
    inc: function (item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function (item) {
      item.qty--;
      this.total -= PRICE;

      if (item.qty <= 0) {
        for (let index = 0; index < this.cart.length; index++) {
          const element = this.cart[index];
          if (element.id === item.id) {
            this.cart.splice(index, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function (price) {
      return "$".concat(price.toFixed(2));
    }
  },
  mounted: function () {
    this.onSubmit();

    var self = this;
    var elem = document.getElementById("product-list-bottom");
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function () {
      self.appendItems();
    });
  },
  computed: {
    noMoreItems: function () {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  }
});
