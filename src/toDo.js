/* 2/22/21
  --> Fixed SpellDetails crash error
  --> Need a method to edit the spell description and name

  - Give method of creating a new spell
  Color CreateSpell icon
  Delete method for spells

  - Give feedback that a save is occurring within SpellDetails


  Console error about <div> as child of <p>

  Dashboard should have conditional rendering if logged in or not
  Clean up Material-Ui styles in React
  Update Readme files

  Close tab confirmation window if save is occurring
*/

/* 2/18/21
  --> spellChart date_created doesn't work with toLocaleString()
  --> Add button or link to listIem Dashboard


  - Need a method to edit the spell description and name
  >> defaultValue doesn't work with a variable
  - Give feedback that a save is occurring within SpellDetails

  - Give method of creating a new spell
  
  --> Refactor handleClicks into single function
  --> Comment out bell alert
  --> Create logout button on sidebar
  --> Logout needs to revoke auth
  --> Trim lengthy text from SpellChart
  --> Add logo and link to main site
  --> Placeholder sidebar buttons

  Dashboard should have conditional rendering if logged in or not
  Clean up Material-Ui styles in React
  Update Readme files

  Close tab confirmation window if save is occurring
*/

/* 2/16/21
  Completed:
  --> Login page template integrated
  --> Signup page template integrate
  -> Dashboard integration in progress

  Todo:
  Login page 
  >needs link for 'Forgot password?'
  >'Remember me' checkbox currently doesn't do anything


*/

/* 2/15/21
  Make a styles helper file
  >>> Look into Material-Ui best practice

  --> Refactor code into new files

  Change form behavior to allow enter press to submit
  --> Add in spell list sorting on client
  **SpellIndex accordion
  **Right align Header
  Fix DB date_modified functionality
  Implement Typography anywhere there's text

  Read and implement Material-Ui auth tracking
  >>> Examples in App Bar

  >>> Search postgres ordering
  !!! Failing test is a timing issue that sometimes works
*/

/* 2/11/21
  --> Fix text post into database
  --> Pull correct text from database on load
  >>> This was working. What's happening is the spell order is changing
  >>> Search postgres ordering

  - Add more material-ui elements & app bar
  --> Replacing Link-to with Button
  Refactor handleClicks into single function

  --> Prevent spaces in usernames
  --> Fix broken tests
  !!! Failing test is a timing issue that sometimes works

  --> Change material-ui password field to hide password

  Make a branch to refactor code into new files
*/

/* 2/10/21
  --> Debounce the code in the editor
  --> Add in material ui elements

  <<Previous>>
  --> Add codemirror syntax highlighting for scheme

  - Back-end tests (22 passing, 1 failing)
  --> CodeMirror code changes post and save in db

  <<Issues>>
  Material-ui text fields don't work with React refs
*/

/* 2/9/21
  --> Make text not centered in codemirror

  - Make back-end tests pass (19 pass / 4 failing)
  - Edits in codemirror should post and be saved in db
  --? Make sure spell id route with codemirror is protected

  --> Write tests to make sure codemirror endpoint requires auth

  <<<>>>
  Does CodeMirror code need to be sanitized before being stored in the database?

*/

