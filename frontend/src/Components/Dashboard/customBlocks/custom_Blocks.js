import Blockly from 'blockly';
import 'blockly/python';

var AtomsJson = {
    "message0": "text input: %1",
    "args0": [
      {"type": "input_value", 
      "name": "FIELDNAME", 
      "variable": "text",},
      
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230
  };

Blockly.Blocks['atoms'] = {
    init: function() {
      this.jsonInit(AtomsJson);
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
      this.setTooltip(function() {
        return 'Add a number to variable "%1".'.replace('%1',
            thisBlock.getFieldValue('VAR'));
      });
    }
  };

  var reactDateField = {
    "type": "test_react_date_field",
    "message0": "date field %1",
    "args0": [
      {
        "type": "field_react_date",
        "name": "DATE",
        "date": "01/01/2020"
      },
    ],
    "previousStatement": null,
    "nextStatement": null,
  };
  
  Blockly.Blocks['test_react_date_field'] = {
    init: function() {
      this.jsonInit(reactDateField);
      this.setStyle('loop_blocks');
    }
};

var defineBlock = {
  "type": "define",
  "message0": "define function %1",
  "args0": [
    {
      "type": "field_input",
      "name": "DATE",
      "text": "define"
    },
    {
      "type": "input_statement",
      "name": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
};


//Define Blocks
Blockly.Blocks['define'] = {
  init: function() {
    this.appendStatementInput("test")
        .setCheck(null)
        .appendField(new Blockly.FieldTextInput("define"), "atom");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['define'] = function(block) {
  // Generate JavaScript for moving forward or backwards.
  var value = block.getFieldValue('VALUE');
  var code = '(' + value + ')';
  return code;
};


//list blocks
Blockly.Blocks['paren'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  this.setTooltip("");
  this.setHelpUrl("");
  }
};

Blockly.JavaScript['paren'] = function(block) {
  // Generate JavaScript for moving forward or backwards.
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  var code = '(' + statements_name + ')';
  return code;
};

//ATOM Block
Blockly.Blocks['atom'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("atom"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['atom'] = function(block) {
  // Generate JavaScript for moving forward or backwards.
  var text_name = block.getFieldValue('NAME');
  var code =  text_name;
  return code;
};

