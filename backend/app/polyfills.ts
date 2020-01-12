interface Array<T> {
  /**
   * Make a shallow copy of the array
   */
  clone (): Array<T>

  /**
   * Take first @param count elements from the array
   * 
   * @param count number of elements to take
   */
  take (count: number): Array<T>

  /**
   * Randomize the order in the array
   */
  randomize (): Array<T>
}

if (Array.prototype.clone === undefined) {
  Array.prototype.clone = function () {
    return this.slice()
  }
}

if (Array.prototype.take === undefined) {
  Array.prototype.take = function (count) {
    return this.slice(0, count)
  }
}

if (Array.prototype.randomize === undefined) {
  Array.prototype.randomize = function () {
      for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this
  }
}
