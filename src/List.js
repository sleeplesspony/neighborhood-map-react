import React, { Component } from 'react';

class List extends Component { 

	render () {

		const { locations, onListItemClick } = this.props
		return (
			<div className="app-sidebar-list-block">
				{ locations.length !== 0 && (
					<ul className="app-sidebar-list">
						{ locations.map((location) => ( 
							<li 
								key={location.id} 
								className="app-sidebar-list-item" 
								onClick={() => onListItemClick(location)}>
								{location.title}
							</li>
						))}
					</ul>
				)}
				{!locations.length && (
					<p>No results</p>
				)}
			</div>
		)
	}
}

export default List