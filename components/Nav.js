import { useRouter } from "next/router";
import propTypes from "prop-types"

const Nav = ({ item }) => {
    const router = useRouter()
    return <>{router.pathname === "/" ? item : ""}</>
}

export default Nav

Nav.propTypes = {
    item: propTypes.string
}