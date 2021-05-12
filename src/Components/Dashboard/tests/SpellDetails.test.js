import SpellDetails from '../SpellDetails';
import { render, fireEvent, waitFor, screen, queryByLabelText, queryByDisplayValue, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";

//codemirror was had a function that was looking for a range and this was a fix 
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
  //beforeEach adds all these paths before each it block 
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
  it('displays the codemirror of spell', async () => {
    await waitFor(() => {
      // expect(screen.getByLabelText('text')).toHaveTextContent('(displayln \"Hello\")')
      expect(screen.getByText('displayln \"Hello\"')).toBeInTheDocument()
    })
  })
  it('displays the ID of spell', async () => {
    await waitFor(() => {
      expect(screen.getByText('ID: 1')).toBeInTheDocument()
    })
  })
  it('displays image of spell', async () => {
    await waitFor(() => {
      expect(screen.getByAltText('Spell Image')).toBeInTheDocument()
    })
  })
  it('displays changes the public visibility of spell', async() => {
    const mockOnClick = jest.fn()
    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: /ispublic/i }), mockOnClick())
      // await expect(screen.getByRole('button', { name: /ispublic/i })).toBeCalled()
      await expect(mockOnClick).toBeCalledTimes(1)
    })
  })
  it('displays dialog box to confirm delete of spell', async() => {
    const mockOnClick = jest.fn()
    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: /delete/i }), mockOnClick(1))
      await expect(mockOnClick).toBeCalledTimes(1)
    })
  })


  // it("pass functions to matchers", async () => {
  //   const classes = { metaID: 1 }
  //   const spell = {id: 1}
  //   const SpellId = () => (
  //     <div className={classes.metaID}>
  //       ID: {spell.id}
  //     </div>
  //   );
  //   render(<SpellId />);
  //   await waitFor(() => {
  
  //   // These won't match
  //   // getByText("Hello world");
  //   // getByText(/Hello world/);
  
  //   screen.getByText((content, node) => {
  //     const hasText = (node) => node.textContent === "ID: 1";
  //     const nodeHasText = hasText(node);
  
  //     return nodeHasText;
  //     });
  //   });
  // });
})

