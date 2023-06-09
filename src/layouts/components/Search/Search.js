import { useEffect, useState, useRef } from 'react';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import * as searchServices from '~/services/searchService';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import { SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hooks';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    const debouncedValue = useDebounce(searchValue, 500);

    const inputRef = useRef();

    useEffect(() => {
        // Nếu không có seach value thì thoát khỏi hàm
        if (!debouncedValue.trim()) {
            setSearchResults([]); // khi xoa o input khong ky tu nao
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            const result = await searchServices.search(debouncedValue);
            setSearchResults(result);
            setLoading(false);
        };
        fetchApi();
    }, [debouncedValue]);

    const handleClear = () => {
        setSearchValue('');
        setSearchResults([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResults(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue); // nếu giá trị input nhập vào đầu tiên là dấu cách thì sẽ không nhận
        }
    };
    return (
        // ing a wrapper <div> or <span> tag around the reference element solves this by creating a new parentNode context.
        <div>
            <HeadlessTippy
                appendTo={() => document.body}
                interactive // cho active vao
                // visible
                visible={showResults && searchResults.length > 0} // nếu kết quả mảng dài hơn 0 thì mới hiển thị
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            {searchResults.map((result) => (
                                <AccountItem key={result.id} data={result} />
                            ))}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult} // khi click ra ngoai
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Search accouts and videos"
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResults(true)}
                    />
                    {/* khi co searchValue thi moi hien dau X */}
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
