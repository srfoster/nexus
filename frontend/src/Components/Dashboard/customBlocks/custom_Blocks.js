import Blockly from 'blockly';

//Deanchor
Blockly.Blocks['deanchor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Deanchor")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['deanchor'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '(deanchor ' + ')';
  return code;
};
 
//IF STATEMENTS
Blockly.Blocks['if_statement'] = {
  init: function() {
    this.appendStatementInput("test-expr")
        .setCheck(null)
        .appendField("If");
    this.appendStatementInput("then-expr")
        .setCheck(null)
        .appendField("then");
    this.appendStatementInput("else-expr")
        .setCheck(null)
        .appendField("else");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['if_statement'] = function(block) {
  var value_test_expr = Blockly.JavaScript.statementToCode(block, 'test-expr');
  var statements_then_expr = Blockly.JavaScript.statementToCode(block, 'then-expr');
  var statements_else_expr = Blockly.JavaScript.statementToCode(block, 'else-expr');
  // TODO: Assemble JavaScript into code variable.
  var code = '(if ' + value_test_expr + ' ' + statements_then_expr + ' ' + statements_else_expr + ' )';
  return code;
};

//COLOR BLOCKS DROPDOWN MENU  
Blockly.Blocks['color_drop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Color")
        .appendField(new Blockly.FieldDropdown([["Green","GREEN"], ["Blue","BLUE"], ["Yellow","YELLOW"], ["Red","RED"], ["Orange","ORANGE"], ["Teal","TEAL"]]), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['color_drop'] = function(block) {
  // Generate JavaScript for moving forward or backwards.
  var value = block.getFieldValue('NAME');
  var code = '(color ' + '"' + value + '"' + ')'
  return code;
};

//Function builds DummyInputBlocks
//string, [list of types]
let defineRacketBlock = (blockName, inputs) => {
  //stores references to input names
  var nameList = [];
  Blockly.Blocks[blockName] = {
    init: function(state) {
      let input = this.appendDummyInput()
      .appendField(blockName)
      nameList = [];    
      for (let i = 0; i < inputs.length; i++){
        const name = "Name" + i;  
        input.appendField(new Blockly.FieldTextInput(), name);
        nameList.push(name);
            
      }
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  Blockly.JavaScript[blockName] = function(block) {    
    var values = nameList.map((nameList) => block.getFieldValue(nameList))
    var code = '(' + blockName + ' ' //+  ' "' + values  + '"' + ')'
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
    code += ')'
    return code;
  };
}

//STATEMENT BLOCKS
let defineStatementRacketBlock = (blockName, inputs) => {
  var nameList = [];
  Blockly.Blocks[blockName] = {
    init: function(state) {
      nameList = [];    
      for (let i = 0; i < inputs.length; i++){
        const name = "Name" + i;
        nameList.push(inputs[i]);
        console.log(name)
        this.appendStatementInput(name)  
          .appendField(inputs[i]);     
      }
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  Blockly.JavaScript[blockName] = function(block) {
    // Generate JavaScript for moving forward or backwards.
    //var values = nameList.map((nameList) => Blockly.JavaScript.statementToCode(block, nameList))
    var code = '(' //+  ' "' + values  + '"' + ')'
    for (let i = 0; i < nameList.length; i++){
      const r = "Name" + i;
      code +=  Blockly.JavaScript.statementToCode(block, r)
      code += " ";
    }
    code += ')'
    return code;
  };

}






//Dummy Blocks, top-bottom connection
defineRacketBlock("color", ["string"]);
defineRacketBlock("force", ["number", "number", "number"]);
defineRacketBlock("anchor", ["string"]);
defineRacketBlock("atom", ["anchor"]);

//Bracket blocks, no displayed text
//defineStatementRacketBlock("parent",[" ", " "]);
defineStatementRacketBlock("paren",[" "])