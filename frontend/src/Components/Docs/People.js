import React, { useState, useEffect } from 'react';
import {linkTo, topDocLink} from './util.js';

function People(props) {

    return (<>
        {topDocLink}
        <p>The CodeSpells community is much larger than we could ever list on one webpage, but special shout outs to the following individuals who have been most recently involved in the project:</p>

        <h2>Current CodeSpells Devs</h2>
        <ul>
            <li>Stephen Foster</li>
            <li>Lindsey Handley</li>
            <li>Justin Foster (Astrum)</li>
            <li>Eric Stevens (Trithir)</li>
            <li>Deven Perkins (dperkheezy)</li>
            <li>Kevinn Arbas</li>
            <li>Carlos Herrera</li>
        </ul>

        <h2>Community Contributors</h2>
        <ul>
            <li>Laurond</li>
            <li>Runi</li>
            <li>Jess</li>
            <li>Woogachaka</li>
            <li>Angoulor</li>
            <li>Kenzo</li>
            <li>Amulgagar</li>
        </ul>

        <h2>Financial Contributors</h2>
        <ul>
            <li>... List Patreon/Twitch Subs ... </li>
        </ul>

        <h2>Past CodeSpells Devs</h2>
        <ul>
            <li>Adrian Lopez-Mobilia (2014-2016)</li>
            <li>Jason Rosenstock (2014-2017)</li>
            <li>Mark Kreitler (2015-2016)</li>
        </ul></>
    )
}

export default People;