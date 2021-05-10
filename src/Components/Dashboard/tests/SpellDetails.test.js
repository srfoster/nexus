import SpellDetails from '../SpellDetails';
import { render, fireEvent, waitFor, screen, queryByLabelText, queryByDisplayValue } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";

document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn()
    };
  };

  return range;
}

describe('When SpellDetail first renders', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={["/spells/1"]}>
        <Route path="/spells/:id">
          <SpellDetails />
        </Route>
      </MemoryRouter>
    )
  });
  it('renders without crashing', () => {})
  it('displays Spell is loading when spell is not loaded', () => {

    expect(screen.getByText('Spell is loading')).toHaveTextContent('Spell is loading')
  });
});

describe('After spell is loaded', () => {
  beforeEach(() => {
      render(
      <MemoryRouter initialEntries={["/spells/1"]}>
        <Route path="/spells/:id">
          <SpellDetails />
        </Route>
      </MemoryRouter>
    )
  });
  it('displays the title of spell', async () => {
    await waitFor(() => {
      expect(screen.getByText('kevinaaa Storm (Fork) 2')).toBeInTheDocument()
    })
  })
  it('displays the name of spell', async () => {
     
    await waitFor(() => {
      const spellName = screen.getByLabelText('Name');
      expect (spellName.value).toBe('kevinaaa Storm (Fork) 2')
    })
  })
  it('displays the description of spell', async () => {
    await waitFor(() => {
      const spellDescription = screen.getByLabelText('Description')
      expect (spellDescription.value).toBe('Swirling storm of apples')
    })
  })
  it('displays the codemirror of spell', () => {
    waitFor(() => {
      expect(screen.getByLabelText('text')).toHaveTextContent('(displayln \"Hello\")')
    })
  })
  it('displays the ID of spell', async () => {
    await waitFor(() => {
      expect(screen.getByText('ID: 1')).toBeInTheDocument()
    })
  })
  it('displays image of spell', () => {
    waitFor(() => {
      expect(screen.getByAltText('Spell Image')).toBeInTheDocument()
    })
  })
  it('displays changes the public visibility of spell', () => {
    console.log(3)
    waitFor(() => {
      fireEvent.click(screen.getByLabelText('isPublic'))
      console.log(1)
      expect(screen.getByLabelText('isPublic')).toBe()
      console.log(2)
    })
  })
  fit("pass functions to matchers", async () => {
    const classes = { metaID: 1 }
    const spell = {id: 1}
    const SpellId = () => (
      <div className={classes.metaID}>
        ID: {spell.id}
      </div>
    );
    render(<SpellId />);
    await waitFor(() => {
  
    // These won't match
    // getByText("Hello world");
    // getByText(/Hello world/);
  
    screen.getByText((content, node) => {
      const hasText = (node) => node.textContent === "ID: 1";
      const nodeHasText = hasText(node);
  
      return nodeHasText;
      });
    });
  });
})

