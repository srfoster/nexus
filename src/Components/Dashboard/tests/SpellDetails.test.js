import SpellDetails from '../SpellDetails';
import { render, fireEvent, waitFor, screen, container, querySelector } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";
import Dialog from "@material-ui/core/Dialog";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

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

    expect(screen.getByRole('alert')).toBeInTheDocument()
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

  // fit('displays changes the public visibility of spell', async() => {
  //   const visibleSvg = "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
  //   const nonVisibleSvg = "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
  //   const mockOnClick = jest.fn()
  //   // console.log('here', mockOnClick)
  //   await waitFor(async () => {
  //     // await fireEvent.click(screen.getByRole('button', { name: /ispublic/i }), mockOnClick)
  //     // await expect(mockOnClick).toBeCalledTimes(1)
  //     await fireEvent.click(screen.getByRole('button', { name: /ispublic/i }))
  //     // const items = await screen.findAllByText(nonVisibleSvg)
  //     // check to see it has a disabled icon and see it sends a rest request 
  //     // expect(document.querySelector('#yes').includes(nonVisibleSvg)).toBeTruthy()
  //   })
  // })

//   it('displays dialog box to confirm delete of spell', async() => {
//     // When the fireEvent.click is called it will look for the button with a name of delete and fire off the mock onClick.
//     // Than the mocked onClick will open a Dialog Box with a heading of 'Test' 
//     const mockOnClick = jest.fn().mockImplementationOnce(() => render(
//       <Dialog open={true}>
//         <h2>Test</h2>
//         <p>Are you sure you see this test?</p>
//       </Dialog>)
//     )
//     //this waits for the site to load a spell
//     await waitFor(async () => {
//       //this "clicks" the delete button
//       await fireEvent.click(screen.getByRole('button', { name: /delete/i }), mockOnClick)
//       //this sees that the mockOnClick was called
//       expect(mockOnClick).toBeCalled()
//       //this looks for a heading with 'test' as a value (case insensitive because of the i flag and regex) to be in the Dialog box that is rendered 
//       expect(screen.getByRole('heading', {name: /test/i})).toBeInTheDocument()
//       expect(screen.getByText(/are you sure you see this test\?/i)).toBeInTheDocument()

//       // 
//     })
//   })
})

