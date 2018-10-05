// Main routes of the app
export default [
	{
		path: '/main',
		component: require('./main.vue'),
		tabs: [
			{
				path: '/home/',
				tabId: 'main-view',
				component: require('./assets/vue/pages/home.vue')
			},
			{
				path: '/add-reminder/',
				tabId: 'add',
				component: require('./assets/vue/pages/add-reminder.vue')
			},
			{
				path: '/pharmacy-search/',
				tabId: 'search',
				component: require('./assets/vue/pages/pharmacy-search.vue')
			}
		]
	}
]