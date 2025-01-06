import { useAppSelector, useAppDispatch } from "../config/redux/hooks";
import { increment, decrement } from "../config/redux/slices/counterSlice";

const Homepage: React.FC = () => {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <>
            <h1>homepage</h1>
            <span>{count}</span>
            <button
                onClick={() => {
                    dispatch(increment());
                }}
            >
                ++
            </button>
            <button
                onClick={() => {
                    dispatch(decrement());
                }}
            >
                --
            </button>
        </>
    );
};

export default Homepage;
