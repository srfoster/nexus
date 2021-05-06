import SpellDetails from '../SpellDetails';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
);

describe('When SpellDetail renders', () => {
        beforeEach(() => {
        // arrange
        fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve([{ description: "Summons a log cabin " ,
        id: 8,
        is_deleted: false,
        is_public: false,
        locked: false,
        name: "Cozy Cabin (Fork)",
        tags: [],
        text: "(displayln)",
        user_id: 5}]),
      }))
      render(<MemoryRouter initialEntries={["/spells/8"]}>
      <Route path="/spells/:id">
        <SpellDetails />
      </Route>
    </MemoryRouter>)
    });
    jest.mock('react-router-dom', () => ({
        useParams: jest.fn().mockReturnValue({ id: '8' }),
      }));
    it('displays SpellDetail heading', () => {
      

      expect(screen.getByTitle('Title')).toHaveTextContent('Cozy Cabin (Fork)')
    });
  });