const HistoryModal = (props: HistoryModalProps) => {
  const { history, onClose } = props;
  return (
    <Modal title='History' visible={true} onCancel={onClose} footer={null}>
      <List
        itemLayout='horizontal'
        dataSource={history}
        renderItem={(item: RequirementHistory) => (
          <List.Item>
            <List.Item.Meta title={item.user} description={item.date} />
            <div>{item.description}</div>
          </List.Item>
        )}
      />
    </Modal>
  );
};
