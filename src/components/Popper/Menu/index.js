import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import { useState } from 'react';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);
const defaultFn = () => {};
function Menu({ children, items = [], onChange = defaultFn }) {
    const [history, setHistory] = useState([{ data: items }]);

    const current = history[history.length - 1]; // lay phan tu cuoi mang

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            return (
                <MenuItem
                    key={index}
                    data={item}
                    onClick={() => {
                        if (isParent) {
                            setHistory((prev) => [...prev, item.children]);
                        } else {
                            onChange(item);
                        }
                    }}
                />
            );
        });
    };

    return (
        <Tippy
            appendTo={() => document.body} // fix lỗi hiện thị warning tippy
            // visible
            hideOnClick={false} // on mouse down thì sẽ không bị ẩn
            interactive // cho active vao
            delay={[0, 700]}
            offset={[12, 10]}
            placement="bottom-end" // vi tri cua tippy
            render={(attrs) => (
                <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                    <PopperWrapper className={cx('menu-popper')}>
                        {history.length > 1 && (
                            <Header
                                title="languege"
                                onBack={() => {
                                    setHistory((prev) => prev.slice(0, history.length - 1));
                                }}
                            />
                        )}
                        <div className={cx('menu-body')}> {renderItems()}</div>
                    </PopperWrapper>
                </div>
            )}
            onHide={() => setHistory((prev) => prev.slice(0, 1))} // khi tippy Ẩn thì sẽ set history về phần tử mảng đầu tiên
        >
            {children}
        </Tippy>
    );
}

export default Menu;
