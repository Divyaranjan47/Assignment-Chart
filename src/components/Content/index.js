import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Content = (props) => {
    const [asigneeInfo, setAsigneeInfo] = useState([]);
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({priority: [], status: [], type: []});
    const statusRef = useRef();
    const typeRef = useRef();
    const priorityRef = useRef();
    useEffect(() => {
        fetch('API/data.json') // We will need pollyfills to make it all browser compatible. I haven't added. If required i can add.
        .then((data) => data.json())
        .then(data => {
            const asignee = {};
            const priority = {};
            const status = {};
            const type = {};
            data.records.forEach(element => {
                if(asignee[element.assignee]) {
                    asignee[element.assignee].push(element);
                } else {
                    asignee[element.assignee] = [element];
                }
                priority[element.priority] = true;
                status[element.status] = true;
                type[element.issue_type] = true;
            });
            setFilters({
                priority: Object.keys(priority),
                status: Object.keys(status),
                type: Object.keys(type)
            })
            setAsigneeInfo(asignee);
            let info = [];
            for(let i in asignee) {
                let item = {
                    name: i.split(' ')[0],
                    value: asignee[i].length,
                };
                info.push(item);
            }
            setData(info);
        })
    }, []);

    const renderOptions = (opts) => {
        const options = opts.map(ele => {
            return <option value={ele}>{ele}</option>
        });

        return options;
    }

    const applyFilter = () => {
        const status = statusRef.current.value;
        const type = typeRef.current.value;
        const priority = priorityRef.current.value;
        let temp = [];
        for(let i in asigneeInfo) {
            let filteredInfo = asigneeInfo[i].filter(ele => {
                return (ele.status === status || !status) && (ele.priority === priority || !priority) && (ele.issue_type === type || !type);
            });
            let item = {
                name: i.split(' ')[0],
                value: filteredInfo.length
            }
            temp.push(item)
        }
        setData(temp);
    }



    return (
        <article className="content">
            <article className="filters">
                <p className="priority">
                    Priority:
                    <select className="select" onChange={applyFilter} ref={priorityRef}>
                        <option value="">Select</option>
                        {renderOptions(filters.priority)}
                    </select>
                </p>
                <p className="status">
                    Status:
                    <select className="select" onChange={applyFilter} ref={statusRef}>
                        <option value="">Select</option>
                        {renderOptions(filters.status)}
                    </select>
                </p>
                <p className="type">
                    Type:
                    <select className="select" onChange={applyFilter} ref={typeRef}>
                        <option value="">Select</option>
                        {renderOptions(filters.type)}
                    </select>
                </p>
            </article>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart width={100} height={40} margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                    }} data={data}>
                    <XAxis dataKey="name" />
                    <YAxis dataKey="value" />
                    <Bar dataKey="value" fill="#8884d8" label={{fontSize: 12}}/>
                </BarChart>
            </ResponsiveContainer>
        </article>
    );
}

export default Content;
