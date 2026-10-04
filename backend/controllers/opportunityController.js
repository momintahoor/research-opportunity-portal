const { pool } = require('../config/db');

function mapOpportunityRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    researchArea: row.research_area,
    facultyName: row.faculty_name,
    department: row.department,
    requiredSkills: row.required_skills,
    availablePositions: row.available_positions,
    applicationDeadline: formatDate(row.application_deadline),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function formatDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const asString = String(value);
  return asString.slice(0, 10);
}

async function createOpportunity(req, res) {
  try {
    const {
      title,
      description,
      researchArea,
      facultyName,
      department,
      requiredSkills,
      availablePositions,
      applicationDeadline,
      status
    } = req.body;

    const opportunityStatus = status || 'Open';

    const [result] = await pool.execute(
      `INSERT INTO opportunities
        (title, description, research_area, faculty_name, department,
         required_skills, available_positions, application_deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description.trim(),
        researchArea.trim(),
        facultyName.trim(),
        department.trim(),
        requiredSkills.trim(),
        Number(availablePositions),
        applicationDeadline,
        opportunityStatus
      ]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM opportunities WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Research opportunity created successfully',
      data: mapOpportunityRow(rows[0])
    });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
}

async function getAllOpportunities(req, res) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM opportunities ORDER BY id ASC'
    );

    return res.status(200).json({
      success: true,
      message: 'Research opportunities retrieved successfully',
      data: rows.map(mapOpportunityRow)
    });
  } catch (error) {
    console.error('Error retrieving opportunities:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
}

async function getOpportunityById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID'
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM opportunities WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Research opportunity not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Research opportunity retrieved successfully',
      data: mapOpportunityRow(rows[0])
    });
  } catch (error) {
    console.error('Error retrieving opportunity:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById
};
