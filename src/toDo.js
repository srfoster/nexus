/* 3/29/21

  Missing tag code

  Seeded loop applies to all tests
  
  Implement server side sorting
  Client side sort query
  Client side search bar

  Confirm all password deletion tests and add more as needed

  
  MySpells first load render error
  Unmounted component errors

  Depopulate extra spells after relevant describe is over
  Sorting of spell endpoint data
  
  Client side tests

  SpellChart sort by column on click

  Server tag endpoint, don't allow repeat tags
  
  Option to manually resize SpellChart column widths

  Add image feature to spells

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  **Dashboard**
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell
    
  **User Flow**
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> If auth token, either redirect to spells from landing, or make landing look like dashboard
  --> Hide the plus button if not relevant to that page or move render to sub-component
  --> Fix console errors about button nesting and unique keys for spellcards
  --> Give forked spells an indicator in the title that they were forked
*/


/* 3/29/21

  Discord
  Unmounted component React timeout issue
  Update endpoint tests to reflect recent changes
  Login auth token not matching on test
  Client side tests

  Server tag endpoint, don't allow repeat tags

  There are rendering issues if someone without auth token tries going directly to a private page
  
  Option to manually resize SpellChart column widths

  Add image feature to spells

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  **Dashboard**
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell
    
  **User Flow**
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> If auth token, either redirect to spells from landing, or make landing look like dashboard
  --> Hide the plus button if not relevant to that page or move render to sub-component
  --> Fix console errors about button nesting and unique keys for spellcards
  --> Give forked spells an indicator in the title that they were forked
*/

/* 3/24/21

  Server tag endpoint, don't allow repeat tags

  There are rendering issues if someone without auth token tries going directly to a private page
  
  Option to manually resize SpellChart column widths

  Add image feature to spells

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  **Dashboard**
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell
    
  **User Flow**
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> If auth token, either redirect to spells from landing, or make landing look like dashboard
  --> Hide the plus button if not relevant to that page or move render to sub-component
  --> Fix console errors about button nesting and unique keys for spellcards
  --> Give forked spells an indicator in the title that they were forked
*/


/* 3/15/21

  Implement .env on client
  Server heroku
  heroku run npm run migrate

  Tagging spells feature

  Normalize CodeMirror dialog size

  Add image feature to spells

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  - If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***

*/


/* 3/15/21
  >> Timeout crash
  >> My Profile UI

  Add image feature to spells

  Spell card accordion fix

  User timeouts should redirect them to a new page and change the UI render to be logged out

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  - Fix the redirect error for non-auth users from /spells to /gallery
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  - If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> Trim spell code
*/


/* 3/12/21

  redirect to edit page of new spell
  >> Currently redirects to My Spells

  Add image feature to spells

  Conditional fork icon rendering
  My Spells fork icon
  Trim spell code

  User timeouts should redirect them to a new page and change the UI render to be logged out

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  - Fix the redirect error for non-auth users from /spells to /gallery
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  - If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> Clicking fork icon should fork the spell
  --> path: POST /spells/:id/fork
*/



/* 3/11/21

  Clicking fork icon should fork the spell
  path: POST /spells/:id/fork
  redirect to edit page of new spell

  Add image feature to spells

  Conditional fork icon rendering
  My Spells fork icon
  Trim spell code

  User timeouts should redirect them to a new page and change the UI render to be logged out

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  - Fix the redirect error for non-auth users from /spells to /gallery
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  - If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> Update tests to check for any new features
*/


/* 3/10/21
  - Update tests to check for any new features
  
  User timeouts should redirect them to a new page and change the UI render to be logged out

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  - Fix the redirect error for non-auth users from /spells to /gallery
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  - If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> Refactor back end code with res[0] to use knex .first()
*/



/* 3/8/21
  - Update tests to check for any new features

  - API refactor of Dashboard post doesn't work

  Refactor back end code with res[0] to use knex .first()

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  - Fix the redirect error for non-auth users from /spells to /gallery
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  - If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> LocaleTime of spells created is not correct
  --> Add in js custom date_created when creating a new table item
  --> On server side, remove any data we don't want sent to client within fetches
*/


/* 3/8/21
  *** Seed command doesn't work 

  --> On server side, remove any data we don't want sent to client within fetches
  Update tests to check for any new features

  --> LocaleTime of spells created is not correct
  --> Add in js custom date_created when creating a new table item

  - Inside the endpoint, look up how to do a join query and combine user and spells
  >> Is there a way to do multiple .wheres?
  >>> The total number of spells
  >>> The object of public spells

  API refactor of Dashboard post doesn't work

  Make UserProfile page work for any user

  --> Hide is_deleted flag from client calls
  --> User DateModified need to be updated

  ? Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile
  - Fix the redirect error for non-auth users from /spells to /gallery
  Create spinner for SpellChart while a spell is being created
  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  - If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> Implement a NotFound page for any route not created
  --> Add new spells stopped giving instant results
  --> Consolidate fetches into an api service file
*/


/* 3/5/21
  Implement React Context
  >> Doing an update fetch to a context?


  Server readme updates: Assumes postgres database, user named admin, no password

  Implement profile page, avatars, and public profile

  - Fix the redirect error for non-auth users from /spells to /gallery

  Create spinner for SpellChart while a spell is being created

  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  Implement a NotFound page
  

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> SpellChart should sort by name, followed by date
*/



/* 3/4/21

  Server readme updates: Assumes postgres database, user named admin, no password
  Implement React Redux

  Implement profile page, avatars, and public profile

  - Fix the redirect error for non-auth users from /spells to /gallery

  Create spinner for SpellChart while a spell is being created

  SpellChart table borders for smaller columns
  Implement sticky header on SpellChart table

  Implement a NotFound page
  

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component
  Scroll bar should not go under the header bar

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***

*/



/* 3/3/21
  **Question**
  X>> Should expected changes on SpellDetails be sent to SpellChart to render if it they haven't been sent to server yet?
  >> Dates in database and user timezone

  Implement profile page, avatars, and public profile

  - Fix the redirect error for non-auth users from /spells to /gallery

  Create spinner for SpellChart while a spell is being created

  - Creating a new spell causes the dialogue box to flicker briefly
  - SpellChart table borders for smaller columns
  - Implement sticky header on SpellChart table

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Hide the plus button if not relevant to that page or move render to sub-component

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror
  *Revise the SpellIndex history.push to accommodate server errors

  ***FINISHED***
  --> Database DateModified is not being filled in.
  --> SpellChart dateModified
  --> SpellChart date created and modified, tooltip hover with more exact timing
  --> Public toggle on SpellChart stopped functioning
  --> Deliver public spells to users that are not logged in
  --> Tooltip on new spell icon isn't showing
  --> Change the public Dashboard display and list items
  --> Move public_spell checks from PublicSpells to server side
*/



/* 3/2/21
  - Database DateModified is not being filled in.

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Change the public Dashboard display and list items
  Hide the plus button if not relevant to that page or move render to sub-component

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  Fix CodeMirror height to fill more of the screen
    
  **User Flow**
  If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror

  ***FINISHED***
  --> Add delete method to SpellDetails
  --> Fix the SpellDetails isPublic button placement
  --> Fix the SpellDetails delete button placement
  --> Fix the SpellDetails loading indicator placement
  --> Add tooltip to icons on SpellDetails
  --> Fix the SpellChart icon column spacing
  - Change SpellDetails spinner to only show as save is occurring, not while debounce is waiting
  - Add isPublic functionality to SpellChart
  - Change spell deletion to flagging as deleted
*/



/* 3/1/21
  Change spell deletion to flagging as deleted

  **Public Spells**
  PublicSpells, cards should identify the creator
  >> Implement Avatar feature?
  PublicSpells code accordion opens all albums at once
  PublicSpells Like, Share, and More buttons need functionality
  PublicSpells needs sorting options and button to change sorting
  - PublicSpells default image or rune icon

  Seed file should contain a few spells with the public flag 

  **Dashboard**
  Change the public Dashboard display and list items
  Hide the plus button if not relevant to that page or move render to sub-component

  **Deletion**
  Add delete method to SpellDetails

  **Likes**
  Add in a like counter to all spells
  Track which spells a user has 'liked'
  Allow only one vote per user per spell

  **Visuals**
  - Fix the SpellDetails isPublic button placement
  Fix the SpellDetails loading indicator placement
  Fix the SpellChart icon column spacing
    
  **User Flow**
  If auth token, either redirect to spells from landing, or make landing look like dashboard
  Close tab confirmation window if save is occurring

  **Misc**
  Create 'Friends' functionality
  Update Readme files
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)
  Give some randomized differences to each "New Spell" that is created
  Deploy database for joint efforts and creating spells
  *Revise the SpellDetails workaround to not re-render CodeMirror

  ***FINISHED***
  --> Dashboard should have conditional rendering if logged in or not
  --> CodeSpells image link is far larger than the image itself -- turn it into an onClick
  --> Set up the all public spells view page
  --> PublicSpells cards only fill a single column
  --> PublicSpells needs to only display spells with the public flag
  --> Delete spell dialogue box currently blacks out the entire screen
  --> CodeMirror text bug & debounce occurring too soon
*/



/* 2/26/21
  Set up the all public spells view page

  - Dashboard should have conditional rendering if logged in or not

  Fix the SpellDetails isPublic button
  Fix the loading indicator placement
  Fix the SpellChart icon column spacing
    
  CodeSpells image link is far larger than the image itself -- turn it into an onClick

  If auth token, either redirect to spells from landing, or make landing look like dashboard
  Add delete method to SpellDetails

  Update Readme files
  Close tab confirmation window if save is occurring
  Add in the "forgot password" functionality on login page
  Fix auth token test randomly failing (server)

  **FINISHED**
  --> Set a full page SpellDetails ternary render instead of a bunch of smaller ternaries
  --> Clean up Material-Ui styles
  --> Rename files to be more accurate. SpellDashboard shouldn't have the word 'spell' in it anymore
  --> Delete unused files
  --> Signup should work and direct user to login
  --> Clean up unused imports
  --> Public/Private toggle button
  --> Deleting a spell should have confirmation pop-up if on SpellIndex
*/



/* 2/25/21
  - Public/Private toggle button

  Set a full page SpellDetails ternary render instead of a bunch of smaller ternaries
  
  Dashboard should have conditional rendering if logged in or not

  Deleting a spell should have confirmation pop-up if on SpellIndex

  Clean up Material-Ui styles
  Update Readme files

  Close tab confirmation window if save is occurring

  Rename files to be more accurate. SpellDashboard shouldn't have the word 'spell' in it anymore
  Delete unused files
  Add in the "forgot password" functionality on login page

  Fix auth token test randomly failing

  **FINISHED**
  --> Line up spell name with description
  --> Give feedback that a save is occurring within SpellDetails
  --> Display eye icon on spells that are flagged public
*/

/* 2/24/21
  >> Refactoring code question

  Line up spell name with description

  Public/Private toggle button
  Display eye icon on spells that are flagged public
  Dashboard should have conditional rendering if logged in or not

  Deleting a spell should have confirmation pop-up if on SpellIndex

  Clean up Material-Ui styles
  Update Readme files

  Close tab confirmation window if save is occurring

  Rename files to be more accurate. SpellDashboard shouldn't have the word 'spell' in it anymore
  Delete unused files
  Add in the "forgot password" functionality on login page

  Fix auth token test randomly failing

  **FINISHED**
  --> Bug fix the create spell button not working
  --> Fix console errors about unique key prop
  --> Password confirmation on create page should be hidden
  --> Changes to spell text fields are not being recognized
  --> The prop `to` is marked as required in `Link`, but its value is `undefined` (LoginPage)
  --> TODO: Verify the object keys are what we want to receive!!!
  --> Final character any changes in SpellDetails isn't updated in state
  --> Give feedback that a save is occurring within SpellDetails
  --> Debounce has timing issues
*/

/* 2/23/21
  TODO: Verify the object keys are what we want to receive!!!

  >> Refactoring code question

  - Changes to SpellDetails only save the last thing altered, not all text fields

  Delete confirmation pop-up if on SpellIndex

  - Give feedback that a save is occurring within SpellDetails


  Dashboard should have conditional rendering if logged in or not
  Clean up Material-Ui styles
  Update Readme files

  Password confirmation on create page should be hidden

  Close tab confirmation window if save is occurring

  Rename files to be more accurate. SpellDashboard shouldn't have the word 'spell' in it anymore
  Delete unused files

  **FINISHED**
  --> Color CreateSpell icon
  --> Button can't be descendant of button (SpellIndex / Dashboard)
  --> Console error about <div> as child of <p> (SpellDetails)
  --> Delete method for spells

*/

/* 2/22/21
  Color CreateSpell icon
  Delete method for spells
  >> Delete from database or flag it?

  - Give feedback that a save is occurring within SpellDetails

  Console error about <div> as child of <p>

  Dashboard should have conditional rendering if logged in or not
  Clean up Material-Ui styles in React
  Update Readme files

  Close tab confirmation window if save is occurring

  **FINISHED**
  --> Fixed SpellDetails crash error
  --> Need a method to edit the spell description and name

  --> Give method of creating a new spell
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

