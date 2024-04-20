import React, { useState, useCallback } from "react";

import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "react-flow-renderer";
import { Button, Modal, Input, Form } from "antd";
import { nodes as initialNodes, edges as initialEdges } from "./elements";
function ReactFlowRenderer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNodeModelOpen, setIsNodeModelOpen] = useState(false);
  const [sinModelData, setSingleModelData] = useState(null);
  const [isModelUpdate, setIsModelUpdate] = useState(false);
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [position, setPosition] = useState(50);
  const [count, setCount] = useState(0);

  const getLocation = () => {
    let data = parseInt(localStorage.getItem("position")) || 0;
    if (count > 3) {
      setPosition(data - 100);
    } else {
      setPosition(data + 400);
    }
    localStorage.setItem("position", JSON.stringify(position));
    return data;
  };

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: ConnectionLineType.SmoothStep,
            animated: true,
            style: { stroke: "grey", strokeWidth: 2, strokeDasharray: "0" },
          },
          eds
        )
      ),
    [setEdges]
  );

  const getNodeId = () => Math.random();

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsNodeModelOpen(false);
    setIsModelUpdate(false);
  };

  const displayCustomNamedNodeModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (data) => {
    onAdd(data.nodeName);
    setIsModalVisible(false);
    setIsNodeModelOpen(false);
    setIsModelUpdate(false);
  };

  const onAdd = useCallback(
    (data) => {
      setCount(count + 1);
      const newNodeId = String(getNodeId());
      const newNode = {
        id: newNodeId,
        data: {
          label: data,
          additionalInfo: "Additional Information",
        },
        position: {
          x: getLocation(),
          y: 0,
        },
        style: {
          color: "black",
          border: "1px solid #0000FF",
          borderRadius: "8px",
          width: 180,
        },
      };
      const newEdges = [];
      if (nodes.length > 0) {
        newEdges.push({
          id: `e${nodes[0].id}-${newNodeId}`,
          source: nodes[0].id,
          target: newNodeId,
          type: "smoothstep",
          style: { stroke: "grey", strokeWidth: 2 },
          animated: true,
        });
      }
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdges));
    },
    [setNodes, setEdges, nodes, count]
  );

  const onNodesDelete = useCallback(
    (nodesToDelete) => {
      const nodeIdsToDelete = new Set(nodesToDelete.map((node) => node.id));
      const updatedEdges = edges.filter(
        (edge) =>
          !nodeIdsToDelete.has(edge.source) && !nodeIdsToDelete.has(edge.target)
      );
      setEdges(updatedEdges);
      const updatedNodes = nodes.filter(
        (node) => !nodeIdsToDelete.has(node.id)
      );
      setNodes(updatedNodes);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const handleNodeClick = (event, node) => {
    setIsNodeModelOpen(true);
    const singleNode = nodes.find((data) => data.id === node.id);
    setSingleModelData(singleNode);
    setUpdatedLabel(singleNode.data.label);
  };

  const handleUpdateModel = () => {
    const updatedNodes = nodes.map((n) =>
      n.id === sinModelData.id ? { ...n, data: { ...n.data, label: updatedLabel } } : n
    );
    setNodes(updatedNodes);
    setIsModelUpdate(false);
  };

  const handleDeleteModel = () => {
    if (sinModelData) {
      const filteredNodes = nodes.filter((n) => n.id !== sinModelData.id);
      setNodes(filteredNodes);
      const filteredEdges = edges.filter(
        (edge) =>
          edge.source !== sinModelData.id && edge.target !== sinModelData.id
      );
      setEdges(filteredEdges);
      setIsNodeModelOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedLabel(e.target.value);
  };

  const handleSave = () => {
    const updatedNodes = nodes.map((n) =>
      n.id === sinModelData.id ? { ...n, data: { ...n.data, label: updatedLabel } } : n
    );
    setNodes(updatedNodes);
    setIsModelUpdate(false);
    setIsNodeModelOpen(false);
  };

  return (
    <div style={{ height: "100vh", margin: "10px" }}>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <Form onFinish={handleOk} autoComplete="off" name="new node">
          <Form.Item label="Node Name" name="nodeName">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={displayCustomNamedNodeModal}>
        Create Node
      </Button>

      <Modal
        title="Node Data"
        visible={isNodeModelOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="delete" type="primary" onClick={handleDeleteModel}>
            Delete Node
          </Button>,
          <Button key="update" type="primary" onClick={handleSave}>
            Update Label
          </Button>,
        ]}
      >
        {sinModelData && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Node Information:
            </p>
            <p style={{ marginBottom: "5px" }}>ID: {sinModelData.id}</p>
            <p style={{ marginBottom: "5px" }}>
              Label: {sinModelData.data.label}
            </p>
            <Input
              value={updatedLabel}
              onChange={handleInputChange}
              placeholder="Enter new label"
            />
          </div>
        )}
      </Modal>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}

export default ReactFlowRenderer;
