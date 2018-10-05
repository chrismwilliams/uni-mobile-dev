<template>
	<!-- App -->
	<div id="app">
		
		<!-- Statusbar -->
		<f7-statusbar></f7-statusbar>

		<!-- Right Panel -->
		<f7-panel right cover layout="dark">
			<f7-view id="right-panel-view" navbar-through :dynamic-navbar="true">
				<f7-navbar title="About" sliding></f7-navbar>
				<f7-pages>
					<f7-page>
						<f7-block>
							<p>Remind Medi is here to help you start remembering to take your medication</p>
						</f7-block>
						<f7-block-title>Home</f7-block-title>
						<f7-block>
							<p>Here you can view all the reminders you've set up</p>
							<p>For any reminder, you can swipe left and hit the delete button to remove</p>
						</f7-block>
						<f7-block-title>Add</f7-block-title>
						<f7-block>
							<p>This is where you add all the customised reminders you wish to set for yourself.</p>
						</f7-block>
						<f7-block-title>Search</f7-block-title>
						<f7-block>
							<p>Search will give you a list of all local pharmacies based on your location, just pull down on the screen to find local stores</p>
						</f7-block>						
					</f7-page>
				</f7-pages>
			</f7-view>
		</f7-panel>
		
		<!-- Main View -->
		<f7-views tabs tabbar-labels-through>
			
			<!-- Home view -->
			<f7-view id="main-view" main tab active navbar-through tabbar-labels-through :dynamic-navbar="true" >
			
				<!-- Navbar -->
				<f7-navbar >
					<f7-nav-center sliding>Remind Medi</f7-nav-center>
					<f7-nav-right>
						<f7-link open-panel="right"><f7-icon ion="ios-information-outline"></f7-icon></f7-link>
					</f7-nav-right>
				</f7-navbar>
				
				<f7-pages tabbar-labels-through>
					<home></home>
				</f7-pages>

			</f7-view>


			<!-- Add view -->
			<f7-view id="add" tab tabbar-labels-through :dynamic-navbar="true">
				<f7-navbar title="Add Reminder"></f7-navbar>
				<f7-pages class="navbar-through" tabbar-labels-through>
					<add></add>
				</f7-pages>
			</f7-view>

			<!-- Search View -->
			<f7-view id="search" tab tabbar-labels-through :dynamic-navbar="true">
				<f7-navbar title="Pharmacy Search"></f7-navbar>
				<f7-pages class="navbar-through" tabbar-labels-through>
					<search></search>
				</f7-pages>
			</f7-view>


			<!-- Main tabbar -->
			<f7-toolbar tabbar>
				<f7-link tab-link="#main-view" active><f7-icon ion="ios-home"></f7-icon><span class="tabbar-label">Home</span></f7-link>
				<f7-link tab-link="#add"><f7-icon ion="ios-plus"></f7-icon><span class="tabbar-label">Add</span></f7-link>
				<f7-link tab-link="#search"><f7-icon ion="ios-navigate"></f7-icon><span class="tabbar-label">Search</span></f7-link>
			</f7-toolbar>

		</f7-views>
	
	</div>
</template>

<script>

	import Home from './assets/vue/pages/home.vue'
	import Add from './assets/vue/pages/add-reminder.vue'
	import Search from './assets/vue/pages/pharmacy-search.vue'

	export default {
		name: 'main',

		data () {
			return {}
		},
		components: {
			Home,
			Add,
			Search
		}
	}

</script>

<style>

	.navbar {
		background-color: #5aa2ab;
	}

	.navbar-inner {
		color: white;
	}

	.tabbar {
		font-size: 10px;
	}

	span.tabbar-label {
		margin-left: 0px !important;
	}

	.right i {
		margin-top: 10px;
		margin-right: 10px;
		color: white;
	}

	.actions-right a.swipeout-delete {
		background: #f44336;
	}

	.tabbar .toolbar-inner {
		padding: 0px;
		background-color: #5aa2ab ;
	}

	a.tab-link {
		color: white;
	}

	a.active.tab-link i {
		color: #213442;
	}

	a.active > * {
		transition: transform 0.7s;
		color: #213442;
	}

	a.link.active-state {
		transform: scale(0.9);
	}
  
</style>