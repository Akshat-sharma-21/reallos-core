import React from 'react';
import PropTypes, { object, string } from 'prop-types';
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
     * Array of the fields to filter through the
     * list of objects.
     *
     * You can also get the value of a deeply nested key
     * by providing the key names separated with a `.`
     *
     * **Example:**
     * ```
     * ["field1", "field2.nestedField1", ...]
     * ```
     */
    filterByFields: PropTypes.arrayOf(PropTypes.string),

    /**
     * Called when a new search value is entered
     * in the searchbar.
     *
     * An array of filtered objects are passed to
     * the callback function.
     */
    onUpdate: PropTypes.func.isRequired,

    /**
     * Placeholder value to display inside the search box.
     * If left out, default placeholder will be used.
     */
    placeholder: PropTypes.string
  };

  shouldComponentUpdate(newProps) {
    return !isEqual(newProps.list, this.props.list);
  }

  componentDidMount() {
    console.log(this.props.list);
    this.props.onUpdate(this.props.list);
  }

  componentDidUpdate() {
    this.updateList(this.searchValue);
  }

  /**
   * Returns corresponding value of a given key.
   *
   * You can also get the value of a deeply nested key
   * by providing the key names separated with a `.`
   *
   * @param {object} item
   * @param {string} key
   */
  _getObjectValue(item, key) {
    const delimeter = '.';
    const keyTokens = key.split(delimeter);
    let value = null;

    keyTokens.forEach(_key => {
      if (value == null) value = item[_key];
      else value = value[_key];
    });

    return value;
  }

  /**
   * Filters and updates the list.
   *
   * @param {string} value
   * The search value to be used for filtering
   */
  updateList(value) {
    this.searchValue = value;
    let filtered = [];

    this.props.list.forEach(item => {
      if (this.matchesSearchCriteria(item))
        filtered.push(item);
    });

    this.props.onUpdate(filtered);
  }

  /**
   * Iterates through the `filterByFields` array and
   * returns `true` if the `item` object matches as per
   * at least one of these filters.
   *
   * Returns `false` otehrwise.
   *
   * @param {object} item
   * The item to be checked for search criteria matching
   *
   * @returns {boolean}
   * If the `item` matches the search criteria
   */
  matchesSearchCriteria(item) {
    for (let i = 0; i < this.props.filterByFields.length; i++) {
      let filter = this.props.filterByFields[i];

      if (this._getObjectValue(item, filter).toLowerCase().indexOf(this.searchValue) !== -1)
        return true;
    }

    return false;
  }

  render() {
    const { placeholder='Search' } = this.props;

    return (
      <FormControl fullWidth variant="outlined">
        <OutlinedInput
          className="search-bar"
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
          placeholder={placeholder}
          onChange={(ev) => this.updateList(ev.currentTarget.value.toLowerCase())}
        />
      </FormControl>
    );
  }
}

export default SearchBar;
