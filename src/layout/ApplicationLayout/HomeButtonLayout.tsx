import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import { useTheme } from "@mui/material";
import { ApplicationRoute } from "@constant/ApplicationRoute/ApplicationRoute";

/**
 * Layout adding a home button when the route isn't "/".
 */
export function HomeButtonLayout() {
  const theme = useTheme();
  const location = useLocation()

  return (
    <>
      {
        location.pathname !== "/" &&
        <Link 
          to={ApplicationRoute.HOME} 
          style={{
            position: "absolute", 
            top: 20, 
            left: 20, 
            textDecoration: "none", 
            color: theme.palette.primary.main,
          }}>
            <HomeIcon style={{ fontSize: "2rem", cursor: "pointer" }} />
        </Link>
      }
      <Outlet />
    </>
  )
}