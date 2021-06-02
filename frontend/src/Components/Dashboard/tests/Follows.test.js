import {Follows} from '../Follows';
import { render, fireEvent, waitFor, screen, container, querySelector } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, useParams, useRouteMatch } from "react-router";