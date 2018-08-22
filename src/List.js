import React, { Component } from 'react';

class List extends Component { 

	render () {

		const { locations, onListItemClick } = this.props
		return (
			<div>
				{ locations.length && (
					<ul className="sidebar-list">
						{ locations.map((location) => ( 
							<li 
								key={location.id} 
								className="sidebar-list-item" 
								onClick={() => onListItemClick(location)}
							>
								{location.title}
							</li>
						))}
					</ul>
				)}

				{locations.length <=0 && (
					<p>No results</p>
				)}
			</div>
		)
	}
}

export default List