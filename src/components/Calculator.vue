<template>
  <div class="container">
    <div class="input-container">
      <h3>Your Name</h3>
      <input v-model="name" type="text" name="" id="" />
    </div>

    <div class="input-container">
      <h4>A</h4>
      <input v-model.number="a" type="number" id="a-input" />
    </div>
    <div class="input-container">
      <h4>B</h4>
      <input v-model.number="b" type="number" id="b-input" />
    </div>
    <div class="input-container">
      <button
        class="font-large"
        :class="{ 'highlight-btn': isPlus }"
        id="btn-plus"
        :name="ButtonStateEnum.plus"
        @click="clickedPlus"
      >
        +
      </button>
      <button
        class="font-large"
        :class="{ 'highlight-btn': isMinus }"
        id="btn-minus"
        :name="ButtonStateEnum.minus"
        @click="clickedMinus"
      >
        -
      </button>
      <button
        class="font-large"
        :class="{ 'highlight-btn': isMultiply }"
        id="btn-multiply"
        :name="ButtonStateEnum.multiply"
        @click="clickedMultiply"
      >
        x
      </button>
      <button
        class="font-large"
        :class="{ 'highlight-btn': isDivide }"
        id="btn-divide"
        :name="ButtonStateEnum.divide"
        @click="clickedDivide"
      >
        /
      </button>
      <button
        id="btn-pow"
        :class="{ 'highlight-btn': isPower }"
        :name="ButtonStateEnum.power"
        @click="clickedPow"
      >
        POW
      </button>
    </div>

    <div class="input-container">
      <h4>Result</h4>
      <span class="result-box" id="result">{{ result }}</span>
    </div>
    <div class="button-container">
      <input v-model="cloudSave" type="checkbox" name="" id="" />
      <span>Cloud Save</span>
    </div>
    <span>cloud save based on your name</span>
    <div class="button-container">
      <button id="load" @click="clickedLoad">Load</button>
      <button id="save" @click="clickedSave">Save</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "PYCH",
      a: 12,
      b: 5,
      result: 0,
      btnState: null,
      cloudSave: true,
      cloudUrl: `${process.env.VUE_APP_CLOUD_URL}/calculator`,
      ButtonStateEnum: {
        plus: "0",
        minus: "1",
        multiply: "2",
        divide: "3",
        power: "4",
      },
    };
  },
  computed: {
    isPlus() {
      return this.btnState === "0";
    },
    isMinus() {
      return this.btnState === "1";
    },
    isMultiply() {
      return this.btnState === "2";
    },
    isDivide() {
      return this.btnState === "3";
    },
    isPower() {
      return this.btnState === "4";
    },
  },
  methods: {
    clickedPlus() {
      this.btnState = this.ButtonStateEnum.plus;
      this.result = this.a + this.b;
    },
    clickedMinus() {
      this.btnState = this.ButtonStateEnum.minus;
      this.result = this.a - this.b;
    },
    clickedMultiply() {
      this.btnState = this.ButtonStateEnum.multiply;
      this.result = this.a * this.b;
    },
    clickedDivide() {
      this.btnState = this.ButtonStateEnum.divide;
      this.result = this.a / this.b;
    },
    clickedPow() {
      this.btnState = this.ButtonStateEnum.power;
      this.result = Math.pow(this.a, this.b);
    },
    calculationByButtonState() {
      switch (this.btnState) {
        case this.ButtonStateEnum.plus:
          this.clickedPlus();
          break;
        case this.ButtonStateEnum.minus:
          this.clickedMinus();
          break;
        case this.ButtonStateEnum.multiply:
          this.clickedMultiply();
          break;
        case this.ButtonStateEnum.divide:
          this.clickedDivide();
          break;
        case this.ButtonStateEnum.power:
          this.clickedPow();
          break;
      }
    },
    /** load operation on local*/
    async clickedLoad() {
      if (this.cloudSave) {
        this.loadCloud();
      } else {
        this.loadLocal();
      }
    },
    async loadCloud() {
      const { data } = await axios.get(`${this.cloudUrl}/load/${this.name}`);
      console.log("data", data);
      if (!this.verifyData(data)) {
        alert("invalid file");
        return;
      }
      this.a = Number.parseFloat(data.a);
      this.b = Number.parseFloat(data.b);
      this.btnState = data.btnState;
      this.calculationByButtonState();
    },
    async loadLocal() {
      const filepath = await this.$dialog.openFileDialog();
      if (!filepath) {
        alert("no file selected");
        return;
      }
      const data = await this.$fs.readFile(filepath);
      if (!this.verifyData(data)) {
        alert("invalid file");
        return;
      }
      this.a = data.a;
      this.b = data.b;
      this.btnState = data.btnState;
      this.calculationByButtonState();
    },
    verifyData(data) {
      if (
        !Number.parseFloat(data.a) &&
        !Number.parseFloat(data.b) &&
        !Number.parseInt(data.buttonState)
      ) {
        return false;
      }
      return true;
    },
    /** save operation on local */
    clickedSave() {
      if (this.cloudSave) {
        this.saveCloud();
      } else {
        this.saveLocal();
      }
    },
    async saveLocal() {
      const data = {
        a: this.a,
        b: this.b,
        btnState: this.btnState,
      };
      const dataStr = JSON.stringify(data);
      const whereToSave = await this.$dialog.saveFileDialog();
      this.$fs.writeFile(whereToSave, dataStr);
    },
    async saveCloud() {
      const data = {
        name: this.name,
        data: {
          a: this.a,
          b: this.b,
          btnState: this.btnState,
        },
      };
      const { data: res } = await axios.post(`${this.cloudUrl}/save`, data);
      console.log(res);
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  margin: 16px;
  align-items: center;
  border: 1px solid black;
  padding: 16px;
  width: 500px;
  background-color: white;
}
.container > .input-container {
  display: flex;
  flex-direction: row;
  margin: 8px 0;
  justify-content: center;
  align-items: center;
}
h4 {
  margin: 8px;
}
input {
  padding: 8px 16px;
}
button {
  width: 50px;
  height: 50px;
  padding: 8px;
  margin: 0 4px;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: white;
}
.font-large {
  font-size: 1.4rem;
}
.result-box {
  padding: 16px;
  display: block;
  width: 200px;
  border: 1px solid gray;
  border-radius: 5px;
}

.button-container {
  display: flex;
  flex-direction: row;
  align-self: flex-end;
}

.button-container > button {
  width: 100px;
}

.button-container > span {
  display: block;
  margin-left: 4px;
}
h3 {
  margin-right: 8px;
}

.highlight-btn {
  background-color: rgb(252, 212, 82);
}
</style>
