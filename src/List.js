import React, { Component } from 'react';

class List extends Component { 

	render () {

		const { locations, onListItemClick } = this.props
		return (
			<div className="app-sidebar-list-block">
				{ locations.length !== 0 && (
					<ul className="app-sidebar-list" aria-label="Restaurants List">
						{ locations.map((location) => ( 
							<li key={location.id} className="app-sidebar-list-item">
								<button onClick={() => onListItemClick(location)}>
									{location.title}
								</button>
							</li>
						))}
					</ul>
				)}
				{!locations.length && (
					<p className="app-sidebar-empty">No results</p>
				)}
			</div>
		)
	}
}

export default List