import { Link } from "react-router";

export const Navbar = () => {
  return (
    <nav>
      <div>
        <div>
            <Link to={"/"}>
                Next<span>Wave</span>
            </Link>
        </div>

      </div>
    </nav>
  );
};
