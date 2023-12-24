import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@page/home/Home";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Deliverers from "@page/deliverers/Deliverers";
import SidebarLayout from "layout/SidebarLayout/SidebarLayout";
import { ApplicationRoute } from "@constant/ApplicationRoute/ApplicationRoute";
import Deliveries from "@page/deliveries/Deliveries";
import DeliveryTours from "@page/delivery-tours/DeliveryTours";

function App() {
  // Defining all the application routes
  const router = createBrowserRouter([
    {
      path: ApplicationRoute.HOME,
      element: <Home />,
    },
    {
      element: <SidebarLayout />,
      children: [
        {
          path: ApplicationRoute.DELIVERERS,
          element: <Deliverers />,
        },
        {
          path: ApplicationRoute.DELIVERIES,
          element: <Deliveries />,
        },
        {
          path: ApplicationRoute.TOURS,
          element: <DeliveryTours />,
        },
      ],
    },
  ]);

  // Create the application theme
  const primaryColor = "#223A54";
  const secondaryColor = "#F94F5A";
  const backgroundColor = "#FFF6FF";
  const theme = createTheme({
    palette: {
      primary: {
        main: primaryColor,
        light: primaryColor,
      },
      secondary: {
        main: secondaryColor,
        light: secondaryColor,
      },
      background: {
        default: "#FFF6FF",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: backgroundColor,
          },
        },
      },
    },
  });

  return (
    <React.StrictMode>
      {/* Provide the application theme */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Providing the router inside the application */}
        <RouterProvider router={router}></RouterProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
