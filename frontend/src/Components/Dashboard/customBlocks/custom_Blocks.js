import Blockly from 'blockly';

//string, [list of types] -> block id??
let numBlocksCreated = 0
export let defineRacketBlock = ({ blockName, inputs, doParens, doBlockName, color, output }) => {
  numBlocksCreated++
  //stores references to input names

  let blockId=blockName+numBlocksCreated

  var nameList = [];
  Blockly.Blocks[blockId] = {
    init: function (state) {
      let input = this.appendDummyInput()
        .appendField(blockName)

      nameList = [];

      for (let i = 0; i < inputs.length; i++) {
        const name = "Name" + i;
        input.appendField(new Blockly.FieldTextInput(), name);
        nameList.push(name);
      }

      // this.setPreviousStatement(true, null);
      // this.setNextStatement(true, null);
      
      if(output)
        this.setOutput(true, null);
      this.setColour(color);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  };

  Blockly.JavaScript[blockId] = function(block) {    
    var values = nameList.map((nameList) => block.getFieldValue(nameList))
    var code = (doParens ? '(' : "") + (doBlockName ? (blockName + ' ') : "") //+  ' "' + values  + '"' + ')'
    for (let i = 0; i < nameList.length; i++){
      if (isNaN(values[i])){
          code += "'" + values[i] + "'";
          code += " ";
      }
      else {
        code +=  values[i];
        code += " ";
        }
    }
    code += (doParens ? ')' : "")
    return code;
  };

  return blockId
}

//STATEMENT BLOCKS
export let defineStatementRacketBlock = ({ blockName, inputs, doParens, doBlockName, color, output }) => {
  numBlocksCreated++
  //stores references to input names

  let blockId=blockName+numBlocksCreated

  var nameList = [];
  Blockly.Blocks[blockId] = {
    init: function(state) {
      let input = this.appendDummyInput()
      .appendField(blockName)

      nameList = [];    
      for (let i = 0; i < inputs.length; i++){
        const name = "Name" + i;
        nameList.push(inputs[i]);
        this.appendValueInput(name)  
          .appendField(inputs[i]);     
      }
      //this.setPreviousStatement(true, null);
      //this.setNextStatement(true, null);
      if(output)
        this.setOutput(true, null);
      this.setColour(color);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  Blockly.JavaScript[blockId] = function(block) {
    // Generate JavaScript for moving forward or backwards.
    //var values = nameList.map((nameList) => Blockly.JavaScript.statementToCode(block, nameList))
    var code = '(' + blockName + "\n"//+  ' "' + values  + '"' + ')'
    for (let i = 0; i < nameList.length; i++){
      const r = "Name" + i;
      code +=  Blockly.JavaScript.statementToCode(block, r)
      code += " \n";
    }
    code += ')'
    return code;
  };

  return blockId
}

export function JSONtoRacketBlock(json){
  if(json.takesUserInput){
    return defineRacketBlock(json)
  }
  else{
    return defineStatementRacketBlock(json)
  }
}
//Dummy Blocks, top-bottom connection
// defineRacketBlock("color", ["string"]);
// defineRacketBlock("force", ["number", "number", "number"]);
// defineRacketBlock("anchor", ["string"]);
// defineRacketBlock("atom", ["anchor"]);

//3.1
