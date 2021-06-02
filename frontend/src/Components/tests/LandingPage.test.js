import { useEffect } from 'react';
import LandingPage from '../LandingPage';
import { render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";




describe('When LandingPage first renders', () => {
    beforeEach(() => {
      const isLoggedIn = false 
        render(
        <MemoryRouter>
            <LandingPage isLoggedIn={isLoggedIn} />
        </MemoryRouter>
      )
    });
    it('renders without crashing', () => {})

    it('shows landing page header' , () => {

    expect(screen.getByText('CodeSpells Spell Sharing')).toBeInTheDocument()
    });
    it('shows landing page header' , () => {

    expect(screen.getByRole('heading')).toHaveTextContent("CodeSpells Spell Sharing")
    });
});
