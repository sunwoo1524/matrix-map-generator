import { h } from 'preact';
import Router from 'preact-router';
import Main from "../routes/Main"
import NotFound from '../routes/NotFound';
import Helmet from 'preact-helmet';

const App = () => (
	<div id="app">
		<Helmet title="매트릭스 맵 생성기" />
		<Router>
			<Main path="/" />
			<NotFound default />
		</Router>
	</div>
);

export default App;
