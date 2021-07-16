export const rawData = [
  {
    name: "force",
    use: "Force relative to your player character.",
    parameter: ["X", "Y", "Z"],
    type: ["number?", "number?", "number?"],
    optional: [false, false, false],
    desc: [
      "X vector of the force",
      "Y vector of the force",
      "Z vector of the force"
    ],
    example: [
      <div>
        <span><b>(force 0 0 -500)</b></span><br/>
        <span style={{color:'#777777'}}>;force to coordiantes x:0 y:0 z:-500</span>
      </div>
    ],
    returns: "void?"
  },
  {
    name: "force-to",
    use: "Force towards a coordinate or other named object.",
    parameter: ["X", "Y", "Z", "Name", "Magnitude"],
    type: ["number?", "number?", "number?", "string?", "number?"],
    optional: [false, false, false, true, false],
    desc: [
      "X vector of the force",
      "Y vector of the force",
      "Z vector of the force",
      "Named object, alternative for  X Y Z",
      "Scale of the force you apply"
    ],
    example: [
      <div>
        <span><b>(force-to "rock" 1000)</b></span><br/>
        <span style={{color:'#777777'}}>;force to object named rock with a magnitude of 1000(maximum 9999)</span>
      </div>,
      <div>
        <span><b>(force-to (hash 'X 0 'Y 0 'Z -500) 1000)</b></span><br/>
        <span style={{color:'#777777'}}>;force to coordinates 0 0 -500 with a magnitude of 1000(maximum 9999)</span>
      </div>
    ],
    returns: "void?"
  },
  {
    name: "anchor",
    use:
      "Attach yourself to another named object, connected objects move together. You can only ancor yourself to only one object, but multiple other objects can anchor themselves to you.",
    parameter: ["Name"],
    type: ["string?"],
    optional: [false],
    desc: ["named object"],
    example: [
      <div>
        <span><b>(anchor "rock" )</b></span><br/>
        <span style={{color:'#777777'}}>;anchor to object named rock, anchored objects move together</span>
      </div>,
      <div>
        <span><b>(anchor (hash 'X 0 'Y 0 'Z -500))</b></span><br/>
        <span style={{color:'#777777'}}>;anchor to coordinates 0 0 -500, anchored objects move together</span>
      </div>
    ],
    returns: "void?"
  },
  {
    name: "de-anchor",
    use: "unattach all of your anchors",
    parameter: [],
    type: [],
    optional: [],
    default: [],
    desc: [],
    example: [
      <div>
        <span><b>(de-anchor)</b></span><br/>
        <span style={{color:'#777777'}}>;unanchor all your personal anchors</span>
      </div>],
    returns: "void?"
  },
  {
    name: "locate",
    use: "locates a named object",
    parameter: ["Name"],
    type: ["object"],
    optional: [false],
    desc: ["named object"],
    example: [
      <div>
        <span><b>
          {"(force-to"}<br/>
          {"  (locate"}<br/>
          {"    (first"}<br/> 
          {"      (find-all-nearby)"}<br/>
          {"    )"}<br/>
          {"  ) 1000"}<br/>
          {")"}
</b></span><br/>
<span style={{color:'#777777'}}>;force towards the location of the nearest item to you with a mangitude of 1000</span>
</div>],
    returns: "hash?"
  },
  {
    name: "find-all-nearby",
    use: "find all nearby objects",
    parameter: [],
    type: [],
    optional: [],
    default: [],
    desc: [],
    example: [<div>
        <span><b>
          {"(force-to"}<br/>
          {"  (locate"}<br/>
          {"    (first"}<br/> 
          {"      (find-all-nearby)"}<br/>
          {"    )"}<br/>
          {"  ) 1000"}<br/>
          {")"}
        </b></span><br/>
        <span style={{color:'#777777'}}>;force towards the location of the nearest item to you with a mangitude of 1000</span>
      </div>
    ],
    returns: "list(hash?)?"
  },
  {
    name: "velocity",
    use: "gets the velocity of a named object",
    parameter: ["Name"],
    type: ["string?"],
    optional: [false],
    desc: ["named object"],
    example: [
      <div>
        <span>
          <b>
            (force-to "rock" (velocity "self"))
          </b>
        </span>
        <br/>
        <span style={{color:'#777777'}}>;force towards object named rock with the speed of object named self (replace self with your own name for your own speed)</span>
      </div>
    ],
    returns: "real?"
  },
  {
    name: "color",
    use: "sets the color of your player orb",
    parameter: ["Color"],
    type: ["???"],
    optional: [false],
    desc: ["color to use (currently only red, green, orange, blue)"],
    example: [
      <div>
        <span><b>
          (color "green")
        </b></span><br/>
        <span style={{color:'#777777'}}>;set your color to green</span>
      </div>
    ],
    returns: "void?"
  },
  {
    name: "log!",
    use: "log data to (i assume the console)(i think data is optional)",
    parameter: ["log data"],
    type: ["any"],
    optional: [true],
    desc: [],
    example: [
      <div>
        <span><b>
          (log! "Hello World!")
        </b></span><br/>
        <span style={{color:'#777777'}}>;logs Hello World! to the in game console (to software devs: yes "Hello World!")</span>
      </div>
    ],
    returns: "void?"
  },

  {
    name: "let",
    use: "???",
    parameter: ["???"],
    type: ["???"],
    optional: [false],
    desc: ["???"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "define",
    use:
      "define a value or function, after which directly other code can be executed",
    parameter: ["???"],
    type: ["???"],
    optional: [false],
    desc: ["???"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "lambda",
    use: "???",
    parameter: ["???"],
    type: ["???"],
    optional: [false],
    desc: ["???"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "if",
    use: "executes code block if a given expression is true",
    parameter: ["expression", "code", "alternative code if false"],
    type: ["any expression", "any code", "any code"],
    optional: [false, false, false],
    desc: ["???"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "cond",
    use:
      "executes any number of expressions until one returns true, after which corresponding code gets executed and stops further execution of expressions",
    parameter: ["any number of expressions"],
    type: ["expression"],
    optional: [true],
    desc: ["any valid expression"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "else",
    use:
      "default expression in cond if no other expressions return true, must be placed at end of cond",
    parameter: ["any expression"],
    type: ["expression"],
    optional: [true],
    desc: ["expressed as default expression"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "when",
    use:
      "executes given code if given expression returns true, otherwise expresses to #<void>",
    parameter: ["expression", "code"],
    type: ["expression", "any code"],
    optional: [false, false],
    desc: ["expression that returns true or false", "code to execute"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "match",
    use: "???",
    parameter: ["???"],
    type: ["???"],
    optional: [false],
    desc: ["???"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "match-define",
    use: "???",
    parameter: ["???"],
    type: ["???"],
    optional: [false],
    desc: ["???"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "quote",
    use: "produces a constant value corresponding to given input",
    parameter: ["value"],
    type: ["any"],
    optional: [false],
    desc: ["value to be quoted"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "quasiquote",
    use: "same as quote if no unquote operations are performed",
    parameter: ["value"],
    type: ["any"],
    optional: [false],
    desc: ["value to be quoted"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "unquote",
    use: "escape function for quasiquote",
    parameter: ["value"],
    type: ["any"],
    optional: [false],
    desc: ["does not get quoted within quasiquote expression"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "and",
    use:
      "expressions get evaluated until false get evaluated, if no expression given evaluates true",
    parameter: ["expressions"],
    type: ["any expression"],
    optional: [true],
    desc: ["expressions to be expressed"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "or",
    use:
      "evaluates as the first expression that returns true, evaluates as false if none given",
    parameter: ["expressions"],
    type: ["any expression"],
    optional: [true],
    desc: ["expressions to be expressed"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },
  {
    name: "set!",
    use: "modifies a given variable, fails if variable is not defined yet",
    parameter: ["variable", "new value"],
    type: ["variable", "value"],
    optional: [false, false],
    desc: ["variable to edit", "new value for variable"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: null
  },

  {
    name: "equal?",
    use: "checks if two values are equal",
    parameter: ["value 1", "value 2"],
    type: ["any", "any"],
    optional: [false, false],
    desc: ["first value to compare", "second value to compare"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "string=?",
    use: "checks if all given strings are exactly equal to each other",
    parameter: ["string 1", "subsequent strings"],
    type: ["string", "string"],
    optional: [false, true],
    desc: ["first string", "one or more strings to add to the comparison"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "string-contains?",
    use: "checks if a string contains another substring",
    parameter: ["string", "substring"],
    type: ["string", "string"],
    optional: [false, false],
    desc: [
      "string which must contain a substring",
      "string contained in the first string"
    ],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "eq?",
    use: "checks if two values refer to the same object",
    parameter: ["value 1", "value 2"],
    type: ["any", "any"],
    optional: [false, false],
    desc: ["first value to compare", "second value to compare"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "not",
    use: "returns true if value is false, otherwise returns false",
    parameter: ["value"],
    type: ["any"],
    optional: [false],
    desc: ["any value to invert"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: ">=",
    use: "compares any set of numbers in decreasing order or same value",
    parameter: ["first number", "any subsequent numbers"],
    type: ["number", "number"],
    optional: [false, true],
    desc: ["first number", "further set of numbers to compare with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "<=",
    use: "compares any set of numbers in increasing order, or same value",
    parameter: ["first number", "any subsequent numbers"],
    type: ["number", "number"],
    optional: [false, true],
    desc: ["first number", "further set of numbers to compare with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "=",
    use: "compares if any set of numbers is equal",
    parameter: ["first number", "any subsequent numbers"],
    type: ["number", "number"],
    optional: [false, true],
    desc: ["first number", "further set of numbers to compare with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: ">",
    use: "compares any set of numbers in decreasing order",
    parameter: ["first number", "any subsequent numbers"],
    type: ["number", "number"],
    optional: [false, true],
    desc: ["first number", "further set of numbers to compare with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "<",
    use: "compares any set of numbers in increasing order",
    parameter: ["first number", "any subsequent numbers"],
    type: ["number", "number"],
    optional: [false, true],
    desc: ["first number", "further set of numbers to compare with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "+",
    use:
      "adds any set of numbers together, if no arguments are given, the result is 0",
    parameter: ["any set of numbers"],
    type: ["number", "number"],
    optional: [true, true],
    desc: ["first number", "further set of numbers to compare with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "+",
    use:
      "adds any set of numbers together, if no arguments are given, the result is 0",
    parameter: ["any set of numbers"],
    type: ["number"],
    optional: [true],
    desc: ["set of numbers to add together"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "real?"
  },
  {
    name: "-",
    use:
      "subtracts any set of numbers from the first number, if no subsequent numbers are given returns (- 0 x)",
    parameter: ["first number", "any subsequent numbers"],
    type: ["number", "number"],
    optional: [false, true],
    desc: ["number to subtract from", "numbers to subtract with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "real?"
  },
  {
    name: "+",
    use:
      "multiplies any set of numbers together, if no arguments are given, the result is 1",
    parameter: ["any set of numbers"],
    type: ["number"],
    optional: [true],
    desc: ["set of numbers to multiply together"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "real?"
  },
  {
    name: "-",
    use:
      "divides a number by any set of numbers, if no subsequent numbers are given returns (/ 1 x)",
    parameter: ["first number", "any subsequent numbers"],
    type: ["number", "number"],
    optional: [false, true],
    desc: ["number to divide", "numbers to divide with"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "real?"
  },

  {
    name: "positive?",
    use: "returns true if a number is positive and not zero (> x 0)",
    parameter: ["number to check"],
    type: ["number"],
    optional: [false],
    desc: ["any number"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "negative?",
    use: "returns true if a number is negative and not zero (< x 0)",
    parameter: ["number to check"],
    type: ["number"],
    optional: [false],
    desc: ["any number"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "round",
    use:
      "rounds a number to the nearest integer, resolving ties in favor of even numbers. +inf.0, -inf.0 and +nan.0 return themselves",
    parameter: ["number to round"],
    type: ["rational?"],
    optional: [false],
    desc: ["any number"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number?"
  },
  {
    name: "min",
    use: "returns the lowest number in a set of numbers(minimum 1)",
    parameter: ["number to check", "subsequent numbers"],
    type: ["real?", "real?"],
    optional: [false, true],
    desc: ["any number", "any additional numbers"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number?"
  },
  {
    name: "min",
    use: "returns the lowest number in a set of numbers(minimum 1)",
    parameter: ["number to check", "subsequent numbers"],
    type: ["real?", "real?"],
    optional: [false, true],
    desc: ["any number", "any additional numbers"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number?"
  },
  {
    name: "max",
    use: "returns the highest number in a set of numbers(minimum 1)",
    parameter: ["number to check", "subsequent numbers"],
    type: ["real?", "real?"],
    optional: [false, true],
    desc: ["any number", "any additional numbers"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number?"
  },
  {
    name: "abs",
    use: "returns the absolute value of a number",
    parameter: ["number to modify"],
    type: ["real?"],
    optional: [false, true],
    desc: ["any number"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number?"
  },
  {
    name: "add1",
    use: "returns x+1",
    parameter: ["number"],
    type: ["number"],
    optional: [false],
    desc: ["any number"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number?"
  },
  {
    name: "modulo",
    use: "returns the remainder after division",
    parameter: ["number to divide", "number to divide with"],
    type: ["integer?", "integer?"],
    optional: [false, false],
    desc: ["any integer", "any integer"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number?"
  },

  {
    name: "vec",
    use:
      "returns a vector with the given parameters, if none are given returns a zero length vector. If one is given, returns a vector with size n filled with None; how does vec(n, init) work?",
    parameter: ["length", "subsequent data?"],
    type: ["nat?", "FunC[nat?, AnyC]"],
    optional: [true, true],
    desc: ["i have no idea what this is", "i have no idea what this is"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "vec?"
  },
  {
    name: "+vec",
    use:
      "i will assume this is vector sum(element by element) but cannot find any documentation on this function",
    parameter: [],
    type: [],
    optional: [],
    desc: [],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "vec?"
  },
  {
    name: "*vec",
    use:
      "i will assume this is vector product(element by element; not dot product) but cannot find any documentation on this function",
    parameter: [],
    type: [],
    optional: [],
    desc: [],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "vec?"
  },

  {
    name: "list",
    use: "returns a new list containing all given elements",
    parameter: ["any number of values"],
    type: ["any"],
    optional: [true],
    desc: ["all parameters to add to the list"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "shuffle",
    use: "shuffles a given list",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["the list to be shuffled"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "length",
    use:
      "returns the lenght of a given list; checks needed, not found in racket docs",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["list to determine lenght of"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "first",
    use: "returns the first element of a list",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["the list to get the element from"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },
  {
    name: "second",
    use:
      "returns the second element of a list, throws out of bounds error if not enough elements present",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["the list to get the element from"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },
  {
    name: "third",
    use:
      "returns the third element of a list, throws out of bounds error if not enough elements present",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["the list to get the element from"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },
  {
    name: "last",
    use: "returns the last element of a list",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["the list to get the element from"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },
  {
    name: "rest",
    use:
      "returns the a list containing all elements of the given list except for the first one",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["the list to get the element from"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "empty?",
    use: "returns true if given an empty list",
    parameter: ["list"],
    type: ["list?"],
    optional: [false],
    desc: ["the list to check"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "list?",
    use: "returns true if given a list",
    parameter: ["data"],
    type: ["any"],
    optional: [false],
    desc: ["the parameter to check if it's a list"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "list-ref",
    use: "reference a list's value by index",
    parameter: ["list", "index"],
    type: ["list?", "non negative int"],
    optional: [false, false],
    desc: ["the list to check"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },

  {
    name: "hash",
    use:
      "returns a hash with key value pairs, any number of key value pairs can be used as parameters",
    parameter: ["key", "value"],
    type: ["any", "any"],
    optional: [true, true],
    desc: ["access key to the data, each key has a value", "data"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "hash?"
  },
  {
    name: "hash-ref",
    use: "references a value in a hash by key",
    parameter: ["hash", "key", "failure-result"],
    type: ["hash?", "any", "what the fuck is this"],
    optional: [false, false, true],
    desc: ["the hash to reference", "the key for the data", "what the fuck"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },
  {
    name: "hash-keys",
    use: "returns a list of all keys in a given hash in an unspecified order",
    parameter: ["hash"],
    type: ["hash?"],
    optional: [false],
    desc: ["the hash of which keys must be obtained"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "hash-values",
    use: "returns a list of all values in a given hash in an unspecified order",
    parameter: ["hash"],
    type: ["hash?"],
    optional: [false],
    desc: ["the hash of which values must be obtained"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "hash-has-key?",
    use: "checks if a given hash contains a given key",
    parameter: ["hash", "key"],
    type: ["hash?", "any"],
    optional: [false, false],
    desc: ["the hash of which keys must be checked", "the key to check"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },

  {
    name: "filter",
    use:
      "returns a list with elements of a given list for which a prodedure returns true",
    parameter: ["procedure", "list"],
    type: ["procedure?", "list?"],
    optional: [false, false],
    desc: [
      "any function that can be applied on values in the list",
      "given list"
    ],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "map",
    use: "performs a procedure on one or more given lists",
    parameter: ["procedure", "one or more lists"],
    type: ["procedure?", "list?"],
    optional: [false, false],
    desc: [
      "any function that can be applied on values in the list",
      "given lists"
    ],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "list?"
  },
  {
    name: "findf",
    use:
      "returns the first element in a list for which a given procedure returns false",
    parameter: ["procedure", "list"],
    type: ["procedure?", "list?"],
    optional: [false, false],
    desc: [
      "any function that can be applied on values in the list",
      "given list"
    ],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },
  {
    name: "foldl",
    use:
      "combines all given lists into one element defined by procedure, init gives the combined data so far",
    parameter: ["procedure", "init", "one or more lists"],
    type: ["procedure?", "any", "list?"],
    optional: [false, false],
    desc: [
      "any function that can be applied on values in the list",
      "initial value on which to perform the procedure",
      "given list"
    ],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },
  {
    name: "apply",
    use:
      "applies a procedure on a list defined by all values given and all values within the given list (i do not get keyword args yet)",
    parameter: ["procedure", "values", "list", "keyword-arg"],
    type: ["procedure?", "any", "list?", "any"],
    optional: [false, false],
    desc: [
      "any function that can be applied on values in the list",
      "any values to be added to the beginning of the list",
      "given list",
      "???"
    ],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "any"
  },

  {
    name: "void?",
    use: "returns true if value is #<void> otherwise false",
    parameter: ["value"],
    type: ["any"],
    optional: [false],
    desc: ["value to test"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  },
  {
    name: "number->string",
    use: "converts a given number to a string",
    parameter: [
      "string",
      "radix",
      "convert-mode",
      "decimal-mode",
      "single mode"
    ],
    type: ["any", "???", "???", "???", "??? i don't' get these"],
    optional: [false, true, true, true, true],
    desc: ["number to convert"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "number? boolean?"
  },
  {
    name: "string->number",
    use: "conversts a string to a number, if not a number returns false",
    parameter: ["value"],
    type: ["any"],
    optional: [false],
    desc: ["value to test"],
    example: [<a href="https://docs.racket-lang.org/index.html">see racket docs</a>],
    returns: "boolean?"
  }
];
