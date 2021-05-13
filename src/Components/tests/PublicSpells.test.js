import PublicSpells from '../PublicSpells';
import { render, fireEvent, waitFor, screen, container, querySelector, getByRole } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";
import {SearchBar} from '../../Util.js';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

describe('When Public Spells first renders',  () => {
    //beforeEach adds all these paths before each it block 
     beforeEach(() => {
      render(
        <MemoryRouter initialEntries={["/gallery"]}>
          <Route path="/gallery">
            <PublicSpells />
          </Route>
        </MemoryRouter>
      )
    });
    it('renders without crashing', () => {})
    it('public spells at the top when rendered' , () => {
  
    expect(screen.getByText('Public Spells')).toHaveTextContent('Public Spells')
    });
  });
  describe('What user sees on the screen',  () => {
    //beforeEach adds all these paths before each it block 
     beforeEach(() => {
        //renders the DOM
      render(
        <MemoryRouter initialEntries={["/gallery"]}>
          <Route path="/gallery">
            <PublicSpells />
          </Route>
        </MemoryRouter>
      )
    });
    it('shows public spells' , () => {
    //Checks to see if the heading of "Public Spells" Can be searched as regular text or as regex
    expect(screen.getByRole('heading', {name: "Public Spells"})).toBeInTheDocument()
    });
    it('shows search bar' , () => {

    expect(screen.getByRole('textbox' , {name:/search/i})).toBeInTheDocument()
    });
    it('shows go to previous page button' , () => {

    expect(screen.getByRole('button' , {name:/Go to previous page/i})).toBeInTheDocument()
    });

    it('shows go to next page button' , () => {

    expect(screen.getByRole('button' , {name:/Go to next page/i})).toBeInTheDocument()
    });
    it('shows pagination nav' , () => {

    expect(screen.getByRole('heading' , {name:/pagination navigation/i})).toBeInTheDocument()
    });
    it('shows page 1' , () => {

    expect(screen.getByRole('button' , {name:"page 1"})).toBeInTheDocument()
    });
});
