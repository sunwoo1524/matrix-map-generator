import { h } from 'preact';
import Router from 'preact-router';
import Main from "../routes/Main"
import About from "../routes/About"
import Helmet from 'preact-helmet';

const App = () => (
	<div id="app">
		<Helmet title="매트릭스 맵 메이커" />
		<Router>
			<Main path="/" />
			<About path="/about" />
		</Router>
	</div>
);

export default App;
