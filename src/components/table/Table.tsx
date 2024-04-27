import { Table as AntTable } from 'antd';

// export const setOrders = (sorters: Array<any>) => sorters?.map((item: any) => ({ columnName: item.field, direction: item.order }) );

export const Table = ({
  pagination,
  ...etc
}: any) => {
  return (
    <AntTable
      size="small"
      rowKey="id"
      // emptyText={<div>Harap</div>}

      {...etc}
      
      pagination={{
        position: ["bottomRight"],
        showSizeChanger: true,
        // total: datatable?.recordsFiltered || 0,
        showTotal: (total, [range1, range2]) => `${range1}-${range2} of ${total} items`,
        ...pagination
      }}
    />
  )
}
