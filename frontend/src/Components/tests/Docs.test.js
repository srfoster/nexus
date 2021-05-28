import { useEffect } from 'react';
import Docs from '../Docs/Docs';
import { render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";

describe('When Docs first renders', () => {
    beforeEach(() => {
        render(
        <MemoryRouter>
            <Docs match={{params: {page: "docs"}}} />
        </MemoryRouter>
      )
    });
    it('renders without crashing', () => {});
    it('shows docs page header' , () => {
      expect(screen.getByText('Docs')).toBeInTheDocument()
    });
    it('shows docs header' , () => {
      expect(screen.getByRole('heading')).toHaveTextContent("Docs")
    });
});
