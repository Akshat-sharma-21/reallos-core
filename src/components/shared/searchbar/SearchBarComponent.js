import React from 'react';
import PropTypes, { object } from 'prop-types';
import { isEqual } from 'lodash';
import { OutlinedInput, FormControl, InputAdornment} from '@material-ui/core';
import { SearchIcon } from '@primer/octicons-react';
import './searchbar.css';

/**
 * Renders a search bar.
 * @augments {React.Component<Props>}
 */
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.searchValue = '';
  }
  
  static propTypes = {
    /**
     * List of objects.
     */
    list: PropTypes.arrayOf(object),

    /**
     * Name of the field to filter through the
     * list of objects.
     */
    filterByField: PropTypes.string,

    /**
     * Called when a new search value is entered
     * in the searchbar.
     *
     * An array of filtered objects are passed to
     * the callback function.
     */
    onUpdate: PropTypes.func.isRequired
  };

  shouldComponentUpdate(newProps) {
    return !isEqual(newProps.list, this.props.list);
  }

  componentDidMount() {
    this.props.onUpdate(this.props.list);
  }

  componentDidUpdate() {
    this.updateList(this.searchValue);
  }

  /**
   * Filters and updates the list.
   *
   * @param {string} value
   * The search value to be used for filtering
   */
  updateList(value) {
    // Update the `seachValue` property to be used when component updates
    this.searchValue = value;
    let filtered = [];

    this.props.list.forEach(item => {
      if (item[this.props.filterByField].toLowerCase().indexOf(value) !== -1)
        filtered.push(item);
    });

    this.props.onUpdate(filtered);
  }

  render() {
    return (
      <FormControl fullWidth variant="outlined">
        <OutlinedInput className="search-bar"
          startAdornment={
            <InputAdornment position="start">
              <div style={{
                paddingRight: 10,
                paddingLeft: 10
              }}>
                <SearchIcon className="search-icon" size={18} />
              </div>
            </InputAdornment>
          }
          placeholder="Search"
          onChange={(ev) => this.updateList(ev.currentTarget.value.toLowerCase())}
        />
      </FormControl>
    );
  }
}

export default SearchBar;
