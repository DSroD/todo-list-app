import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import NoteContainer from '../../components/note_container'

const Home: FunctionalComponent = () => {
    return (
        <div class={style.home}>
            <NoteContainer></NoteContainer>
        </div>

    );
};

export default Home;
