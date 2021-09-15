# nexus
The Nexus of the CodeSpells community. Deployed at [nexus.codespells.org](http://nexus.codespells.org). 

Interested in contributing to this open source project? The first step is to install Docker on your machine. You can find a download for Docker [here](https://www.docker.com/get-started). Then, follow these instructions:

## Installation:

Pre-Installation:
(Windows users only)
```
git config --global core.autocrlf false
```

Main Installation:
```
git clone git@github.com:srfoster/nexus.git
cd nexus
docker-compose -f stack.yml build
```

## Development:

```
docker-compose -f stack.yml up
```

The database should get created and seeded the first time you do this.

Now you should be able to edit files in `frontend/` or `backend/`.  Reloading should be automatic.

## Running tests:

```
docker exec -it backend npm run test
docker exec -it frontend npm run test
```

Or you can run a specific test with this command:
```
docker exec -it frontend npm test -- FileTo.test.js
docker exec -it backend npm test -- FileTo.test.js
```

# Video Content Guidelines

Videos in the nexus need to render inside of Unreal.  Currently, the only known format that renders correctly is OGV, so convert videos from mp4 to ogv with:

```
ffmpeg -i INPUT.mp4 -c:v libtheora -q:v 7 -c:a libvorbis -q:a 4 OUTPUT.ogv
```

Also, for efficient loading 640x480 is a good resolution, so use:

```
ffmpeg -i INPUT.ogv -vf scale=640:480 -c:v libtheora -q:v 7 -c:a libvorbis -q:a 4 OUTPUT.ogv
```


# Production

Many obvious DevOps improvements could be made here (up to a level of fanciness that includes having a CI do everything when we commit to `master`), but for now, let's just document the process as-is.

Some resources are remote (i.e. do not run on a user's computer).  Here's how you deploy changes:

* To deploy the **React UI**: Run `npm run build` in `frontend/` and copy `build/*` to the S3 Bucket `nexus-codespells-org`.  You should then see the contents live at https://nexus-codespells-org.s3.amazonaws.com/index.html and (via Rout53 and Cloudfront) at https://nexus.codespells.org.
* To deploy the **React UI Node.js Backend**: ssh into the box running the production server (`ubuntu@50.19.137.51`), follow the steps in the `README` to pull down the latest code from `backend` and to restart the webserver.

Some resources are local (i.e. run on the user's computer).  Here's how you deploy changes to those:

* To deploy a new **CodeSpells.exe Launcher Installer**: Put a new `CodeSpells.exe` in the `codespells-org` S3 Bucket in the `Nexus/Installer/` folder.  It should be hosted here: `https://codespells-org.s3.amazonaws.com/Nexus/Installer/CodeSpells.exe`.  NOTE: The exe needs to be cryptographically signed with our magic key so that people know the publisher is "ThoughtSTEM, LLC" (TODO: Put instructions about this somewhere.  In the wiki?).  NOTE: Updating this file does nothing for users who have already downloaded and installed it.   Only new installations are affected.  You should rarely need to change this.  All it does is fetch the "Installer Logic" and run it.
* To deploy a new **CodeSpells.exe Launcher Installer Logic**: Update `https://codespells-org.s3.amazonaws.com/Nexus/Installer/what-to-do-next.rkt`.  The above installer merely fetches this file and evals it.  NOTE: Changing this file changes what happens when ANY CodeSpells users launches the game.  If you break this file, you break all CodeSpells installations (much like if you broke a webpage, you would break it all visitors).  Currently, this file looks for new versions of CodeSpells, fetches them, and unzips them.  You would update this file if you wanted to make changes to the UI for managing/fetching/unzipping CodeSpells versions.
* To deploy a new version of the **CodeSpells World** (the world itself or its bundled Racket langauge): Make a new Unreal build (see https://github.com/srfoster/OrbWorldVoxels), bundle Racket with it (see the Wiki page on creating a Build. TODO: Where is that wiki page?).  Compress it with 7zip into an archive named `0.1.zip` (replacing `0.1` with the actual version number).  Then update the file https://codespells-org.s3.amazonaws.com/Nexus/Versions/latest-version to ensure that the **Installer Logic** detects a new version and fetches/unzips it. 

