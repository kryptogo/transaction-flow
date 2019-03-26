<template>
 <div>
  <div>
     <h1 align="center" v-on:click="click()">中本聪今天出现了吗?</h1>
     <h2 align="center" style="color: red;" v-show="show">没有</h2>
  </div>
  <div>
    <div style="float: right; margin: 30px;">
    <input v-model="address"/>
    <button v-on:click="getDiagram()">查找</button>
    </div>
    <div>
    <VueFlowy :chart='chart'></VueFlowy>
    </div>
  </div>
  </div>
</template>

<style>

</style>
<script>
import { dataSources, getClient } from '../libs/ocap'
import {VueFlowy, FlowChart} from 'vue-flowy'

export default {
  name: 'app',

  components: {
    VueFlowy
  },

  data: () => ({
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    show: false,
    chart: new FlowChart()
  }),

methods: {
  click: function () {
    this.show = true;
  },
getRelations: function resolveGraph(a) {
    // result.then(a => {
    let finalResult = {
        outSet: null,
        inSet: null
    };
    let out = a.accountByAddress.transactions;
    let income = a.accountByAddress.transactions;
    let outSet = new Set();
    let inSet = new Set();
    if (out.data.length > 0) {
        out.data.forEach(x => {
            x.outputs.data.map(x => x.account).forEach(x => outSet.add(x))
        });
    }
    if (income.data.length > 0) {
        income.data.forEach(x => {
            x.inputs.data.map(x => x.account).forEach(x => inSet.add(x))
        });
    }
    finalResult.outSet = Array.from(outSet);
    finalResult.inSet = Array.from(inSet);

    console.log(finalResult)
    return finalResult;
},
getAccount: function getFromAndToByAddress(address) {
    console.log("调用函数了")
    console.log(address)
    if (address == null) {
        address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    }
    const client = getClient('btc');
    let result = client.doRawQuery(` {
        accountByAddress(address: "` + address + `") {
        	address balance
    			transactions {
    			  data {
    			    hash
    			    blockHash
    			    inputs {
    			      data {
    			        account
    			      }
    			    }
    			    outputs {
    			      data {
    			        account
    			      }
    			    }
    			  }
    			}
        }
    }`);
    return result;
},
getDiagram: function() {
    this.chart = new FlowChart()
    var center = this.chart.addElement(this.address)
    var map = new Map();
    map.set(this.address, center)
    let a = this.getAccount(this.address);
    a.then(a => this.getRelations(a)).then(
      a => {
        a.inSet.forEach(o => {
          let node = map.get(o)
          if(node == undefined) {
            node = this.chart.addElement(o)
            map.set(o, node)
            node.leadsTo(center)
          } else {
            node.leadsTo(center)
          }

         //第一层
          let inCenter1 = o
          console.log(inCenter1)
          let inA1 = this.getAccount(inCenter1);
          inA1.then(ina1 => this.getRelations(ina1)).then(
            ina1 => {
              ina1.inSet.forEach(ino1 => {
                let inNode1 = map.get(ino1)
                if(inNode1 == undefined) {
                  inNode1 = this.chart.addElement(ino1)
                  map.set(ino1, inNode1)
                  inNode1.leadsTo(inCenter1)
                } else {
                  inNode1.leadsTo(inCenter1)
                }
                console.log(inNode1)

                //第二层
                let inCenter2 = ino1
                let inA2 = this.getAccount(inCenter2);
                inA2.then(ina2 => this.getRelations(ina2)).then(
                  ina2 => {
                    ina2.inSet.forEach(ino2 => {
                      let inNode2 = map.get(ino2)
                      if(inNode2 == undefined) {
                        inNode2 = this.chart.addElement(ino2)
                        map.set(ino2, inNode2)
                        inNode2.leadsTo(inCenter2)
                      } else {
                        inNode2.leadsTo(inCenter2)
                      }
                    })
                  }
                )

              })
            }
          )

        })
        a.outSet.forEach(o => {
          let node = map.get(o)
          if(!node) {
            node = this.chart.addElement(o)
            map.set(o, node)
            center.leadsTo(node)
          } else {
            center.leadsTo(node)
          }

         //第一层
          let outCenter1 = o
          let outA1 = this.getAccount(outCenter1);
          outA1.then(outa1 => this.getRelations(outa1)).then(
            outa1 => {
              outa1.outSet.forEach(outo1 => {
                let outNode1 = map.get(outo1)
                if(outNode1 == undefined) {
                  outNode1 = this.chart.addElement(outo1)
                  map.set(outo1, outNode1)
                  outNode1.leadsTo(outCenter1)
                } else {
                  outNode1.leadsTo(outCenter1)
                }

                //第二层
                let outCenter2 = outo1
                let outA2 = this.getAccount(outCenter2);
                outA2.then(outa2 => this.getRelations(outa2)).then(
                  outa2 => {
                    outa2.outSet.forEach(outo2 => {
                      let outNode2 = map.get(outo2)
                      if(outNode2 == undefined) {
                        outNode2 = this.chart.addElement(outo2)
                        map.set(outo2, outNode2)
                        outNode2.leadsTo(outCenter2)
                      } else {
                        outNode2.leadsTo(outCenter2)
                      }
                    })
                  }
                )

              })
            }
          )
        })
      }
    );
}

},

  mounted() {
      console.log(this.chart)
      this.getDiagram()
  }
}
</script>

