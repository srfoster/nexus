import PublicSpells from '../PublicSpells';
import { render, fireEvent, waitFor, screen, container, querySelector, getByRole  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";
import { SearchBar } from '../../Util.js';
import Pagination from '@material-ui/lab/Pagination';

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
    it('shows search icon' , () => {
      expect(screen.getByRole('button' , {name:/search icon/i})).toBeInTheDocument()
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
      expect(screen.getByRole('navigation' , {name: 'pagination navigation'})).toBeInTheDocument()
    });
    it('shows pagination button' , () => {
      render(<Pagination count={1} />)
      expect(screen.getByRole('button' , {name:"page 1"})).toBeInTheDocument()
    });
});
    describe('What user interacts with on the screen',  () => {
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
        it('shows search icon' , () => {

        // render(<SearchBar />)

        //still need to figure out how to show that the search box is hidden before user click
        expect(screen.getByPlaceholderText("Search Spells")).toBeInTheDocument()

        userEvent.click(screen.getByRole('button' , {name:/search icon/i}))

        expect(screen.getByPlaceholderText("Search Spells")).toBeInTheDocument()
    });
});
