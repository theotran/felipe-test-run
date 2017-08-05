import React from 'react';

const TypeSelect = () => (
  <div className="form-group">
    <label htmlFor="" >Type</label>
    <select className="form-control">
      <option defaultValue value="residential">Residential</option>
      <option value="commercial">Commercial</option>
    </select>
  </div>
);

const StatusSelect = () => (
  <div className="form-group">
    <label htmlFor="">Status</label>
    <select className="form-control">
      <option defaultValue value="lead">Lead</option>
      <option value="active">Active</option>
      <option value="on-hold">On-Hold</option>
      <option value="complete">Complete</option>
    </select>
  </div>
)


export { TypeSelect, StatusSelect };